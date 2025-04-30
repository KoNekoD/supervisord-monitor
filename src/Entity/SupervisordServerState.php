<?php

declare(strict_types=1);

namespace App\Entity;

use App\DTO\Supervisord\ProcessGroup;
use App\Repository\SupervisordServerStateRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SupervisordServerStateRepository::class)]
class SupervisordServerState
{
    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    private ?int $id = null;

    /** @var array<int, array<string, mixed>> $groups */
    #[ORM\Column(type: 'json', options: ['jsonb' => true])]
    public array $groups;

    #[ORM\Column]
    public string $version;

    #[ORM\Column]
    public bool $ok;

    #[ORM\Column]
    public string $server;

    #[ORM\Column(type: 'text', nullable: true)]
    public ?string $failError;

    public function __construct() {
        $this->groups = [];
        $this->version = '';
        $this->ok = true;
        $this->server = '';
        $this->failError = null;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /** @return array<int, ProcessGroup> */
    public function getGroups(): array
    {
        $fn = static fn(array $group): ProcessGroup => new ProcessGroup($group['name'], $group['processes']);

        return array_map($fn, $this->groups);
    }

    /** @param array<int, ProcessGroup> $groups */
    public function setGroups(array $groups): self
    {
        $this->groups = $groups;

        return $this;
    }

    public function getVersion(): string
    {
        return $this->version;
    }

    public function setVersion(string $version): self
    {
        $this->version = $version;

        return $this;
    }

    public function isOk(): bool
    {
        return $this->ok;
    }

    public function setOk(bool $ok): self
    {
        $this->ok = $ok;

        return $this;
    }

    public function getServer(): string
    {
        return $this->server;
    }

    public function setServer(string $server): self
    {
        $this->server = $server;

        return $this;
    }

    public function getFailError(): ?string
    {
        return $this->failError;
    }

    public function setFailError(?string $failError): self
    {
        $this->failError = $failError;

        return $this;
    }
}
