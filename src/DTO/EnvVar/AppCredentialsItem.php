<?php

declare(strict_types=1);

namespace App\DTO\EnvVar;

class AppCredentialsItem
{
    public string $username;

    public string $password;

    /** @var string[] $roles */
    public array $roles = [];
}
