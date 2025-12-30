<?php

namespace App\Controller\Api;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/products', name: 'api_products_')]
class ProductController extends AbstractController
{
    // Listar productos REALES de la base de datos
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(ProductRepository $repository): JsonResponse
    {
        $products = $repository->findAll();
        
        $data = array_map(function(Product $p) {
            return [
                'id' => $p->getId(),
                'name' => $p->getName(),
                'price' => $p->getPrice(),
                'stock' => $p->getStock(),
                'description' => $p->getDescription()
            ];
        }, $products);

        return $this->json($data);
    }

    // Crear producto (Ruta corregida a nivel de método)
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['name']) || empty($data['price'])) {
            return new JsonResponse(['error' => 'Nombre y precio son obligatorios'], 400);
        }

        $product = new Product();
        $product->setName($data['name']);
        $product->setPrice((float)$data['price']);
        $product->setStock((int)($data['stock'] ?? 0));
        $product->setDescription($data['description'] ?? '');

        $em->persist($product);
        $em->flush();

        return new JsonResponse([
            'message' => 'Producto creado con éxito',
            'id' => $product->getId()
        ], 201);
    }
}