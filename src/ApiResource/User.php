<?php

declare(strict_types=1);

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\Controller\LoginController;
use App\Controller\LogoutController;
use App\DTO\AuthByCredentialsDTO;
use App\State\UserMeProvider;
use Lexik\Bundle\JWTAuthenticationBundle\Security\User\JWTUserInterface;
use stdClass;
use Symfony\Component\Security\Core\User\UserInterface;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/auth/login',
            controller: LoginController::class,
            input: AuthByCredentialsDTO::class,
            output: stdClass::class,
        ),
        new Post(
            uriTemplate: '/auth/logout',
            controller: LogoutController::class,
            input: stdClass::class,
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
    /** @param string[] $roles */
    public function __construct(private readonly string $username, private readonly array $roles) {}

    public function getUsername(): string
    {
        return $this->username;
    }

    public function getRoles(): array
    {
        return array_values(array_unique(array_merge(['ROLE_USER'], $this->roles)));
    }

    public function eraseCredentials(): void {}

    public function getUserIdentifier(): string
    {
        return $this->username;
    }

    /** @param array{roles: string[]} $payload */
    public static function createFromPayload($username, array $payload): self
    {
        return new self($username, $payload['roles']);
    }
}
