<?php

declare(strict_types=1);

namespace App\Console;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Webmozart\Assert\Assert;

#[AsCommand('app:build-server-json')]
class ProvideSupervisorServerJsonConsole extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $arr = [];

        if ($io->confirm('Import existing servers?', false)) {
            /** @var string $json */
            $json = $io->ask('Enter servers json', validator: static function (string $v): string {
                Assert::string($v);

                return $v;
            });

            /** @var array<int, array{ip?: string|int, port?: string|int, name?: string|int, username?: string|int, password?: string|int}> $arr */
            $arr = (array)json_decode($json, true);

            $res = [];
            foreach ($arr as $v) {
                if (!isset($v['ip'], $v['port'], $v['name'])) {
                    continue;
                }

                $res[$v['name']] = ['ip' => (string)$v['ip'], 'port' => (int)$v['port'], 'name' => (string)$v['name']];

                if (isset($v['username'], $v['password'])) {
                    $res[$v['name']]['username'] = (string)$v['username'];
                    $res[$v['name']]['password'] = (string)$v['password'];
                }
            }

            $arr = array_values($res);
        }

        $arr = $this->builder($io, $arr);

        $output->writeln((string)json_encode($arr));

        return Command::SUCCESS;
    }

    /**
     * @param array<int|string, mixed> $arr
     * @return array<int|string, mixed>
     */
    private function builder(SymfonyStyle $io, array $arr = []): array
    {
        $this->print($io, $arr);

        $choice = $io->choice('What do you want to do?', ['Add', 'Delete', 'Quit'], 'Add');

        if ('Delete' === $choice) {
            $names = array_column($arr, 'name');
            if ([] === $names) {
                $io->warning('No one server exists');

                return $this->builder($io, $arr);
            }

            $name = $io->choice('Which server do you want to delete?', $names);

            if (!in_array($name, array_column($arr, 'name'))) {
                $io->warning('Not found');

                return $this->builder($io, $arr);
            }

            $arr = array_filter($arr, static fn($v): bool => (
                is_array($v) && isset($v['name']) && is_string($v['name']) && $name !== $v['name'])
            );

            return $this->builder($io, $arr);
        }

        if ('Add' === $choice) {
            $newItem = $this->getServerConfig($io);

            if (in_array($newItem[0]['name'], array_column($arr, 'name'))) {
                $io->warning('Already has name');

                return $this->builder($io, $arr);
            }

            array_push($arr, ...$newItem);

            return $this->builder($io, $arr);
        }

        return $arr;
    }

    /** @param array<int|string, mixed> $arr */
    private function print(SymfonyStyle $io, array $arr): void
    {
        $count = count($arr);

        $table = $io->createTable();
        $table->setHeaderTitle('Supervisor Servers');
        $table->setHeaders(['ip', 'port', 'name', 'username', 'password']);

        /** @var array{ip: string, port: int, name: string, username?: string, password?: string} $v */

        foreach ($arr as $v) {
            $table->addRow([$v['ip'], $v['port'], $v['name'], $v['username'] ?? '', $v['password'] ?? '']);
        }

        $table->render();
        $io->text(sprintf('Total: %s', $count));
    }

    /** @return array<int, array{ip: string, port: int, name: string, username?: string, password?: string}> */
    private function getServerConfig(SymfonyStyle $io): array
    {
        $ipFn = static function (string $v): string {
            Assert::ip($v);

            return $v;
        };
        $portFn = static function (int $v): int {
            Assert::positiveInteger($v);
            Assert::lessThan($v, 65536);

            return $v;
        };

        [$ip, $port, $name, $username, $password] = [
            $io->ask('IP', '127.0.0.1', $ipFn),
            $io->ask('Port', '9551', $portFn),
            $io->ask('Name', 'default'),
            $io->ask('Username'),
            $io->ask('Password'),
        ];

        $arr = ['ip' => $ip, 'port' => $port, 'name' => $name];
        if (null !== $username && null !== $password) {
            $arr += ['username' => $username, 'password' => $password];
        }

        /** @var array{ip: string, port: int, name: string, username?: string, password?: string} $arr */

        return [$arr];
    }
}
