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

        if (!$data) {
            return $this->json(['error' => 'JSON inválido'], 400);
        }

        // 1. Buscar al usuario por código o por ID (Priorizamos user_code del JSON)
        //$user = $userRepository->findOneBy(['user_code' => $data['user_code'] ?? '']);

        $user = null;
        if (isset($data['user_code'])) {
            $user = $userRepository->findOneBy(['user_code' => $data['user_code']]);
        }

        if (!$user && isset($data['userId'])) {
            $user = $userRepository->find($data['userId']);
        }

        if (!$user) {
            return $this->json([
                'error' => 'Usuario no encontrado. Recibido ID: ' . ($data['userId'] ?? 'null') . ' y Código: ' . ($data['user_code'] ?? 'null')
            ], 404);
        }

        // 2. Crear y PERSISTIR la Orden principal primero (Evita el error de New Entity)
        $order = new Order();
        $order->setNumberOrder('ORD-' . strtoupper(substr(uniqid(), -6)));
        $order->setCustomer($user);
        $order->setStatus(OrderStatus::PENDING);
        $order->setCreatedAt(new \DateTime());

        $em->persist($order); // <--- Clave para evitar el error que tuviste

        $totalPrice = 0;

        // 3. Procesar productos
        // Usamos el campo 'quantity' que ya viene en tu objeto de React
        foreach ($data['items'] as $itemData) {
            $product = $productRepository->find($itemData['id']);

            if (!$product) {
                return $this->json(['error' => "Producto ID {$itemData['id']} no existe"], 404);
            }

            $cantidadSolicitada = (int)$itemData['quantity'];

            // Validar STOCK
            if ((float)$product->getStock() < $cantidadSolicitada) {
                return $this->json(['error' => "Stock insuficiente para: " . $product->getName()], 400);
            }

            // Crear el Item de la orden
            $orderItem = new OrderItem();
            $orderItem->setProduct($product);
            $orderItem->setQuantity($cantidadSolicitada);
            $orderItem->setPrice($product->getPrice());
            $orderItem->setOrderRef($order);

            // Restar stock
            $product->setStock((string)((float)$product->getStock() - $cantidadSolicitada));

            // Acumular total
            $totalPrice += ((float)$product->getPrice() * $cantidadSolicitada);

            $em->persist($orderItem);
        }

        // 4. Finalizar y Guardar
        $order->setTotalPrice((string)$totalPrice);

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
                'subtotal' => (float)$item->getPrice() * $item->getQuantity()
            ], $order->getOrderItems()->toArray())
        ]);
    }
}
