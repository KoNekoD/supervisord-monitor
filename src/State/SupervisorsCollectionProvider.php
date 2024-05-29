<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiClient\SupervisorApiClient;
use App\ApiResource\Supervisor;
use App\DTO\SupervisorServer;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

final readonly class SupervisorsCollectionProvider implements ProviderInterface
{
    /** @param array<string, SupervisorServer> $servers */
    public function __construct(
        public SupervisorApiClient $api,
        #[Autowire(param: 'supervisors_servers')] private array $servers
    ) {}

    /** @return Supervisor[] */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        /** @var Supervisor[] $result */
        $result = [];

        foreach ($this->servers as $server) {
            $result[] = $this->api->getSupervisor($server);
        }

        return $result;
    }
}
