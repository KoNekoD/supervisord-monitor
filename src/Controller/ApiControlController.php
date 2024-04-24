<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\Input\WorkerDTO;
use App\Service\SupervisorsApiManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

#[AsController]
class ApiControlController extends AbstractController
{
    public function __construct(private readonly SupervisorsApiManager $apiManager) {}

    #[Route('/api/control/start', methods: ['POST'])]
    public function startProcess(#[MapRequestPayload] WorkerDTO $DTO): JsonResponse
    {
        return $this->json($this->apiManager->startProcess($DTO));
    }

    #[Route('/api/control/startAll/{server}', methods: ['POST'])]
    public function startAllProcesses(string $server): JsonResponse
    {
        return $this->json($this->apiManager->startAllProcesses($server));
    }

    #[Route('/api/control/stop', methods: ['POST'])]
    public function stopProcess(#[MapRequestPayload] WorkerDTO $DTO): JsonResponse
    {
        return $this->json($this->apiManager->stopProcess($DTO));
    }

    #[Route('/api/control/startProcessGroup/{server}/{group}', methods: ['POST'])]
    public function startProcessGroup(string $server, string $group): JsonResponse
    {
        return $this->json($this->apiManager->provideClient($server)->startProcessGroup($group));
    }

    #[Route('/api/control/stopProcessGroup/{server}/{group}', methods: ['POST'])]
    public function stopProcessGroup(string $server, string $group): JsonResponse
    {
        return $this->json($this->apiManager->provideClient($server)->stopProcessGroup($group));
    }

    #[Route('/api/control/restartProcessGroup/{server}/{group}', methods: ['POST'])]
    public function restartProcessGroup(string $server, string $group): JsonResponse
    {
        return $this->json($this->apiManager->provideClient($server)->restartProcessGroup($group));
    }

    #[Route('/api/control/stopAll/{server}', methods: ['POST'])]
    public function stopAllProcesses(string $server): JsonResponse
    {
        return $this->json($this->apiManager->stopAllProcesses($server));
    }

    #[Route('/api/control/restart', methods: ['POST'])]
    public function restartProcess(#[MapRequestPayload] WorkerDTO $DTO): JsonResponse
    {
        return $this->json($this->apiManager->restartProcess($DTO));
    }

    #[Route('/api/control/restartAll/{server}', methods: ['POST'])]
    public function restartAllProcesses(string $server): JsonResponse
    {
        return $this->json($this->apiManager->restartAllProcesses($server));
    }

    #[Route('/api/control/clearProcessLog', methods: ['POST'])]
    public function clearProcessLog(#[MapRequestPayload] WorkerDTO $DTO): JsonResponse
    {
        return $this->json($this->apiManager->clearProcessLogs($DTO));
    }

    #[Route('/api/control/cloneProcess', methods: ['POST'])]
    public function cloneProcess(#[MapRequestPayload] WorkerDTO $DTO): JsonResponse
    {
        return $this->json($this->apiManager->cloneProcess($DTO));
    }

    #[Route('/api/control/removeProcess', methods: ['POST'])]
    public function removeProcess(#[MapRequestPayload] WorkerDTO $DTO): JsonResponse
    {
        return $this->json($this->apiManager->removeProcess($DTO));
    }

    #[Route('/api/control/clearAllProcessLog/{server}', methods: ['POST'])]
    public function clearAllProcessLog(string $server): JsonResponse
    {
        return $this->json($this->apiManager->clearAllProcessLogs($server));
    }

    #[Route('/api/control/data', methods: ['GET'])]
    public function getData(): JsonResponse
    {
        return $this->json($this->apiManager->provideAllProcessInfo());
    }
}
