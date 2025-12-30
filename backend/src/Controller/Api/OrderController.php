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

            if (!$product) {
                return $this->json(['error' => "Producto ID {$itemData['productId']} no existe"], 404);
            }

            if ($product->getStock() < $itemData['quantity']) {
                return $this->json(['error' => "Stock insuficiente para: " . $product->getName()], 400);
            }

            $orderItem = new OrderItem();
            $orderItem->setProduct($product);
            $orderItem->setQuantity($itemData['quantity']);
            // Forzamos el precio actual del producto al item
            $orderItem->setPrice($product->getPrice());
            $orderItem->setOrderRef($order);

            // Restamos stock directamente en el objeto
            $product->setStock($product->getStock() - $itemData['quantity']);

            // Calculamos el total acumulado convirtiendo a float
            $totalPrice += ((float)$product->getPrice() * (int)$itemData['quantity']);

            $em->persist($orderItem);
        }

        $order->setTotalPrice((string)$totalPrice); // Guardamos como string para el tipo Decimal

        $order->setTotalPrice((string)$totalPrice); // Convertimos a string por el tipo Decimal
        $em->persist($order);
        $em->flush();

        return $this->json([
            'message' => 'Pedido creado con éxito',
            'orderId' => $order->getId(),
            'total' => $order->getTotalPrice()
        ], 201);
    }
    #[Route('/{id}/checkout', name: 'checkout', methods: ['POST'])]
    public function pay(Order $order, EntityManagerInterface $em): JsonResponse
    {
        // Validación de estado: solo se paga lo que está pendiente
        if ($order->getStatus() !== OrderStatus::PENDING) {
            return $this->json(['error' => 'El pedido ya no se puede pagar (Estado actual: ' . $order->getStatus()->value . ')'], 400);
        }

        $order->setStatus(OrderStatus::PAID);
        $em->flush();

        return $this->json([
            'message' => '¡Pago procesado con éxito!',
            'orderId' => $order->getId(),
            'newStatus' => $order->getStatus()->value
        ]);
    }
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(Order $order): JsonResponse
    {
        return $this->json([
            'id' => $order->getId(),
            'status' => $order->getStatus()->value,
            'total' => $order->getTotalPrice(),
            'items' => array_map(fn($item) => [
                'product' => $item->getProduct()->getName(),
                'qty' => $item->getQuantity(),
                'subtotal' => $item->getPrice() * $item->getQuantity()
            ], $order->getOrderItems()->toArray())
        ]);
    }
}
