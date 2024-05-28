<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Serializer\Attribute\Ignore;

class SupervisorServer
{
    public string $webOpenUrl;
    public bool $authenticated;

    public function __construct(
        public string $ip,
        public int $port,
        public string $name,
        public ?string $username,
        public ?string $password
    ) {
        $this->authenticated = (
            null !== $this->username && null !== $this->password
        );

        $credentials = '';
        if ($this->authenticated) {
            $credentials = $this->username.':'.$this->password.'@';
        }

        $this->webOpenUrl = sprintf(
            'http://%s%s:%d/',
            $credentials,
            $this->ip,
            $this->port
        );
    }

    #[Ignore]
    public function getUrl(): string
    {
        return sprintf(
            'http://%s:%s/RPC2',
            $this->ip,
            $this->port
        );
    }
}
