<?php

namespace App\Controller\Api;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Enum\OrderStatus;
use App\Repository\ProductRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/orders', name: 'api_orders_')]
class OrderController extends AbstractController
{
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(
        Request $request,
        UserRepository $userRepository,
        ProductRepository $productRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // 1. Buscar al usuario (ID 1 por defecto si no viene, para pruebas rápidas)
        $userId = $data['userId'] ?? 1;
        $user = $userRepository->find($userId);

        if (!$user) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        $order = new Order();
        $order->setCustomer($user); // Ahora coincide con tu entidad
        $order->setStatus(OrderStatus::PENDING);
        $order->setCreatedAt(new \DateTime()); // Ahora coincide con tu entidad

        $totalPrice = 0;

        // 2. Procesar productos y validar STOCK
        foreach ($data['items'] as $itemData) {
            $product = $productRepository->find($itemData['productId']);

            if (!$product) continue;

            // Lógica de negocio: Validar stock disponible
            if ($product->getStock() < $itemData['quantity']) {
                return $this->json([
                    'error' => "Stock insuficiente para: " . $product->getName()
                ], 400);
            }

            $orderItem = new OrderItem();
            $orderItem->setProduct($product);
            $orderItem->setQuantity($itemData['quantity']);
            $orderItem->setPrice($product->getPrice());
            $orderItem->setOrderRef($order);

            // IMPORTANTE: Restar el stock
            $product->setStock($product->getStock() - $itemData['quantity']);

            $totalPrice += ($product->getPrice() * $itemData['quantity']);
            $em->persist($orderItem);
        }

        $order->setTotalPrice((string)$totalPrice); // Convertimos a string por el tipo Decimal
        $em->persist($order);
        $em->flush();

        return $this->json([
            'message' => 'Pedido creado con éxito',
            'orderId' => $order->getId(),
            'total' => $order->getTotalPrice()
        ], 201);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Order $order): JsonResponse
    {
        // UC-002: Ver detalle del pedido
        $items = [];
        foreach ($order->getOrderItems() as $item) {
            $items[] = [
                'product' => $item->getProduct()->getName(),
                'quantity' => $item->getQuantity(),
                'price' => $item->getPrice()
            ];
        }

        return $this->json([
            'id' => $order->getId(),
            'status' => $order->getStatus()->value,
            'total' => $order->getTotalPrice(),
            'items' => $items
        ]);
    }
}
