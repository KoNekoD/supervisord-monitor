<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiClient\SupervisorApiClient;
use App\ApiResource\Supervisor;
use App\DTO\EnvVar\SupervisorServer;
use App\Repository\SupervisordServerStateRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Request;

final readonly class SupervisorsCollectionProvider implements ProviderInterface
{
    /** @param array<string, SupervisorServer> $servers */
    public function __construct(
        public SupervisorApiClient $supervisorApiClient,
        private SupervisordServerStateRepository $supervisordServerStateRepository,
        #[Autowire(param: 'supervisordServers')] private array $servers,
        private EntityManagerInterface $entityManager
    ) {}

    /** @return Supervisor[] */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        /** @var Request $request */
        $request = $context['request'];

        /** @var Supervisor[] $result */
        $result = [];

        if ($request->query->get('sync-refresh') === 'true') {
            foreach ($this->servers as $server) {
                $result[] = $this->supervisorApiClient->getSupervisor($server);
            }

            return $result;
        }

        $states = $this->supervisordServerStateRepository->findAll();

        // Sort by server name from $this->servers
        $newStates = [];
        foreach ($this->servers as $server) {
            foreach ($states as $state) {
                if ($state->getServer() === $server->name) {
                    $newStates[] = $state;
                }
            }
        }

        foreach ($newStates as $state) {
            $server = $this->servers[$state->getServer()] ?? null;

            if (null === $server) {
                $this->entityManager->remove($state);
                $this->entityManager->flush();

                continue;
            }

            $result[] = new Supervisor(
                $state->getGroups(),
                $state->getVersion(),
                $state->isOk(),
                $server,
                $state->getFailError()
            );
        }

        return $result;
    }
}
