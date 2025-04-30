<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250427163901 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
            CREATE TABLE supervisord_server_state (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, groups CLOB NOT NULL --(DC2Type:json)
            , version VARCHAR(255) NOT NULL, ok BOOLEAN NOT NULL, server VARCHAR(255) NOT NULL, fail_error CLOB DEFAULT NULL)
        SQL);
    }

    public function down(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
            DROP TABLE supervisord_server_state
        SQL);
    }
}
