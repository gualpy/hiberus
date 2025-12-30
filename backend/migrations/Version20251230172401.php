<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251230172401 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `order` ADD number_order VARCHAR(50) NOT NULL, CHANGE customer_id customer_id INT NOT NULL');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F52993989395C3F3 FOREIGN KEY (customer_id) REFERENCES user (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_F52993984E601050 ON `order` (number_order)');
        $this->addSql('CREATE INDEX IDX_F52993989395C3F3 ON `order` (customer_id)');
        $this->addSql('ALTER TABLE product ADD cod_product VARCHAR(50) NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D34A04AD41F2F439 ON product (cod_product)');
        $this->addSql('ALTER TABLE user ADD user_code VARCHAR(20) NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649D947C51 ON user (user_code)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `order` DROP FOREIGN KEY FK_F52993989395C3F3');
        $this->addSql('DROP INDEX UNIQ_F52993984E601050 ON `order`');
        $this->addSql('DROP INDEX IDX_F52993989395C3F3 ON `order`');
        $this->addSql('ALTER TABLE `order` DROP number_order, CHANGE customer_id customer_id VARCHAR(50) NOT NULL');
        $this->addSql('DROP INDEX UNIQ_D34A04AD41F2F439 ON product');
        $this->addSql('ALTER TABLE product DROP cod_product');
        $this->addSql('DROP INDEX UNIQ_8D93D649D947C51 ON user');
        $this->addSql('ALTER TABLE user DROP user_code');
    }
}
