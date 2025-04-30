<?php

declare(strict_types=1);

namespace App\Command;

use App\ApiClient\SupervisorApiClient;
use App\DTO\EnvVar\SupervisorServer;
use App\Entity\SupervisordServerState;
use App\Repository\SupervisordServerStateRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

#[AsCommand(self::COMMAND)]
class CollectSupervisordServerDataCommand extends Command
{
    public const string COMMAND = 'app:collect-supervisord-server-data';

    /** @param array<string, SupervisorServer> $supervisorServers */
    public function __construct(
        private readonly SupervisorApiClient $api,
        private readonly EntityManagerInterface $entityManager,
        #[Autowire(param: 'supervisordServers')] private readonly array $supervisorServers,
        private readonly SupervisordServerStateRepository $supervisordServerStateRepository
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('server', InputArgument::REQUIRED, 'Server name');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $server = $input->getArgument('server');

        if (is_int($server)) {
            $server = (string)$server;
        }
        if (!is_string($server)) {
            $output->writeln('<error>Excepted to be string</error>');

            return self::FAILURE;
        }
        if (!isset($this->supervisorServers[$server])) {
            $output->writeln('<error>Server not found</error>');

            return self::FAILURE;
        }

        $result = $this->api->getSupervisor($this->supervisorServers[$server]);

        $state = $this->supervisordServerStateRepository->findOneBy(['server' => $result->server->name]);
        if (null === $state) {
            $state = new SupervisordServerState();
            $this->entityManager->persist($state);
        }

        $state
            ->setGroups($result->groups)
            ->setVersion($result->version)
            ->setOk($result->ok)
            ->setServer($result->server->name)
            ->setFailError($result->failError);

        $this->entityManager->flush();

        return self::SUCCESS;
    }
}
