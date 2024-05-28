<?php

declare(strict_types=1);

namespace App\Console;

use App\DTO\SupervisorServer;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Serializer\SerializerInterface;

#[AsCommand('app:provide-supervisor-server-json')]
class ProvideSupervisorServerJsonConsole extends Command
{
    public function __construct(private readonly SerializerInterface $serializer)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setDescription('Provide supervisor server json')
            ->setHelp('Provide supervisor server json')
            ->addArgument('ip', InputArgument::REQUIRED)
            ->addArgument('port', InputArgument::REQUIRED)
            ->addArgument('name', InputArgument::OPTIONAL)
            ->addArgument('username', InputArgument::OPTIONAL)
            ->addArgument('password', InputArgument::OPTIONAL);
    }

    protected function execute(
        InputInterface $input,
        OutputInterface $output
    ): int {
        /** @var string $ip */
        $ip = $input->getArgument('ip');

        /** @var string $portString */
        $portString = $input->getArgument('port');
        $port = (int)$portString;

        /** @var string $name */
        $name = $input->getArgument('name') ?? 'unnamed-'.$ip.':'.$port;

        /** @var ?string $username */
        $username = $input->getArgument('username') ?? null;

        /** @var ?string $password */
        $password = $input->getArgument('password') ?? null;

        $DTO = new SupervisorServer(
            ip: $ip,
            port: $port,
            name: $name,
            username: $username,
            password: $password
        );

        $json = $this->serializer->serialize($DTO, 'json');

        $output->writeln($json);

        return Command::SUCCESS;
    }
}
