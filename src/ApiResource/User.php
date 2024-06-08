<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\Controller\AuthUserController;
use App\DTO\AuthByCredentialsDTO;
use App\State\UserMeProvider;
use Lexik\Bundle\JWTAuthenticationBundle\Security\User\JWTUserInterface;
use stdClass;
use Symfony\Component\Security\Core\User\UserInterface;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/auth/login',
            controller: AuthUserController::class,
            input: AuthByCredentialsDTO::class,
            output: stdClass::class,
        ),
        new Get(
            uriTemplate: '/users/me',
            provider: UserMeProvider::class,
        ),
    ],
)]
class User
    implements UserInterface, JWTUserInterface
{
    public function __construct(private readonly string $username) {}

    public function getUsername(): string
    {
        return $this->username;
    }

    public function getRoles(): array
    {
        return ['ROLE_USER'];
    }

    public function eraseCredentials(): void {}

    public function getUserIdentifier(): string
    {
        return $this->username;
    }

    /** @param array{} $payload */
    public static function createFromPayload($username, array $payload): self
    {
        return new self($username);
    }
}
