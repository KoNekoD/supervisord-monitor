<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\User;
use Symfony\Bundle\SecurityBundle\Security;

/** @implements ProviderInterface<User> */
final readonly class UserMeProvider
    implements ProviderInterface
{
    public function __construct(private Security $security) {}

    public function provide(
        Operation $operation,
        array $uriVariables = [],
        array $context = []
    ): User {
        /** @var User $user */
        $user = $this->security->getUser();

        return $user;
    }
}
