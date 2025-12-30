<?php
namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/products', name: 'api_products_')]
class ProductController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        // Simulación de base de datos para avanzar rápido
        $products = [
            ['id' => 1, 'name' => 'Monitor Gaming', 'price' => 250.00, 'stock' => 10],
            ['id' => 2, 'name' => 'Teclado Mecánico', 'price' => 80.50, 'stock' => 5],
            ['id' => 3, 'name' => 'Mouse Pro', 'price' => 45.00, 'stock' => 0],
        ];

        return $this->json($products);
    }
}