<?php

declare(strict_types=1);

namespace App\Service\Symfony;

use App\DTO\EnvVar\SupervisorServer;
use Closure;
use Symfony\Component\DependencyInjection\EnvVarProcessorInterface;
use Symfony\Component\DependencyInjection\Exception\EnvNotFoundException;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Yaml\Yaml;

final readonly class SupervisordServerEnvVarProcessor implements EnvVarProcessorInterface
{
    public function __construct(private SerializerInterface&DenormalizerInterface $serializer) {}

    public static function getProvidedTypes(): array
    {
        return [
            'supervisordServers' => 'string',
        ];
    }

    /** @return array<string, SupervisorServer> */
    public function getEnv(string $prefix, string $name, Closure $getEnv): array
    {
        $type = SupervisorServer::class.'[]';

        try {
            $data = $getEnv($name);

            /** @var SupervisorServer[] $servers */
            $servers = $this->serializer->deserialize($data, $type, 'json');
        } catch (EnvNotFoundException) {
            $data = Yaml::parseFile('/var/www/supervisord-monitor/config/app/supervisord_servers.yaml');
            $data = is_array($data) ? $data['supervisors_servers'] ?? [] : [];

            /** @var SupervisorServer[] $servers */
            $servers = $this->serializer->denormalize($data, $type, 'json');
        }


        $result = [];

        foreach ($servers as $server) {
            $result[$server->name] = $server;
        }

        return $result;
    }
}
