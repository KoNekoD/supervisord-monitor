<?php

declare(strict_types=1);

namespace App\Service\Symfony;

use App\DTO\EnvVar\SupervisorServer;
use Closure;
use Symfony\Component\DependencyInjection\EnvVarProcessorInterface;
use Symfony\Component\Serializer\SerializerInterface;

final readonly class SupervisorServerEnvVarProcessor implements EnvVarProcessorInterface
{
    public function __construct(private SerializerInterface $serializer) {}

    public static function getProvidedTypes(): array
    {
        return [
            'supervisorsServers' => 'string',
        ];
    }

    /** @return array<string, SupervisorServer> */
    public function getEnv(string $prefix, string $name, Closure $getEnv): array
    {
        $data = $getEnv($name);

        $type = SupervisorServer::class.'[]';

        /** @var SupervisorServer[] $servers */
        $servers = $this->serializer->deserialize($data, $type, 'json');

        $result = [];

        foreach ($servers as $server) {
            $result[$server->name] = $server;
        }

        return $result;
    }
}
