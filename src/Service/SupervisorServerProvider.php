<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\SupervisorServer;
use App\Exception\BaseException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

final readonly class SupervisorServerProvider
{
    public function __construct(
        private DenormalizerInterface $denormalizer,
        #[Autowire(param: 'supervisors_servers')]
        private string $servers,
    ) {}

    public function provide(string $server): SupervisorServer
    {
        foreach ($this->provideList() as $supervisorServer) {
            if ($supervisorServer->name === $server) {
                return $supervisorServer;
            }
        }

        throw new BaseException("Server $server not found");
    }

    /** @return SupervisorServer[] */
    public function provideList(): array
    {
        /** @var class-string $type */
        $type = SupervisorServer::class.'[]';
        try {
            /** @var SupervisorServer[] $result */
            $result = $this->denormalizer->denormalize($this->servers, $type);

            return $result;
        } catch (ExceptionInterface $e) {
            throw new BaseException($e->getMessage(), $e->getCode(), $e);
        }
    }
}
