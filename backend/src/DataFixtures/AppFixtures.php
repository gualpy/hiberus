<?php

namespace App\DataFixtures;

use App\Entity\Product;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // 1. Crear Usuario Admin
        $admin = new User();
        $admin->setUsername('admin')
            ->setRoles(['ROLE_ADMIN'])
            ->setPassword('123456'); // En producción usaríamos UserPasswordHasherInterface
        $manager->persist($admin);

        // 2. Crear Usuario Cliente
        $client = new User();
        $client->setUsername('cliente')
            ->setRoles(['ROLE_USER'])
            ->setPassword('123456');
        $manager->persist($client);

        // 3. Crear Productos para el catálogo
        for ($i = 1; $i <= 5; $i++) {
            $product = new Product();
            $product->setName("Producto $i")
                ->setDescription("Descripción de prueba para el producto $i")
                ->setPrice(10.5 * $i)
                ->setStock(10);
            $manager->persist($product);
        }

        // Guardar todo en la base de datos
        $manager->flush();
    }
}
