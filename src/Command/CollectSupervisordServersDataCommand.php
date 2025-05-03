<?php

declare(strict_types=1);

namespace App\Command;

use App\ApiClient\SupervisorApiClient;
use App\DTO\EnvVar\SupervisorServer;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Process\Process;

#[AsCommand('app:collect-supervisord-servers-data')]
class CollectSupervisordServersDataCommand extends Command
{
    /** @param array<string, SupervisorServer> $supervisorServers */
    public function __construct(
        public SupervisorApiClient $api,
        #[Autowire(param: 'supervisordServers')] private readonly array $supervisorServers,
        #[Autowire(param: 'collectIntervalInMicroseconds')] private readonly int $collectIntervalInMicroseconds,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // @phpstan-ignore-next-line
        while (true) {
            $this->collect($output);
            usleep($this->collectIntervalInMicroseconds);
        }
    }

    private function collect(OutputInterface $output): void
    {
        foreach ($this->supervisorServers as $server) {
            $process = new Process(['bin/console', CollectSupervisordServerDataCommand::COMMAND, $server->name]);
            $process->mustRun();

            $out = $process->getOutput();
            if ('' !== $out) {
                $output->writeln($out);
            }

            $err = $process->getErrorOutput();
            if ('' !== $err) {
                $output->writeln('<error>'.$err.'</error>');
            }
        }
    }
}
