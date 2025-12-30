<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // --- 1. AGREGAR USUARIOS ---
        
        // Cliente
        $userCliente = new User();
        $userCliente->setUsername('cliente');
        $userCliente->setRoles(['ROLE_USER']);
        $userCliente->setPassword('1234'); 
        $userCliente->setUserCode('USR-001'); // Tu clave subrogada/natural
        $manager->persist($userCliente);

        // Administrador
        $userAdmin = new User();
        $userAdmin->setUsername('admin');
        $userAdmin->setRoles(['ROLE_ADMIN']);
        $userAdmin->setPassword('4321');
        $userAdmin->setUserCode('ADM-001'); // Tu clave subrogada/natural
        $manager->persist($userAdmin);

        // --- 2. AGREGAR 4 PRODUCTOS ---

        $productosData = [
            ['cod' => 'PROD-MONITOR', 'name' => 'Monitor Gaming 27"', 'price' => 299.99, 'stock' => 10, 'desc' => 'Panel IPS 144Hz'],
            ['cod' => 'PROD-TECLADO', 'name' => 'Teclado Mecánico', 'price' => 85.00, 'stock' => 15, 'desc' => 'Switches Cherry MX Red'],
            ['cod' => 'PROD-MOUSE', 'name' => 'Mouse Wireless', 'price' => 45.50, 'stock' => 20, 'desc' => 'Ergonómico con 6 botones'],
            ['cod' => 'PROD-HEADSET', 'name' => 'Auriculares Pro', 'price' => 120.00, 'stock' => 5, 'desc' => 'Cancelación de ruido activa'],
        ];

        foreach ($productosData as $p) {
            $producto = new Product();
            $producto->setCodProduct($p['cod']); // Tu clave natural
            $producto->setName($p['name']);
            $producto->setPrice($p['price']);
            $producto->setStock($p['stock']);
            $producto->setDescription($p['desc']);
            $manager->persist($producto);
        }

        // Guardamos todo
        $manager->flush();
    }
}