<?php

declare(strict_types=1);

namespace App\Tests\Functional;

use App\ApiClient\SupervisorApiClient;
use App\DTO\EnvVar\SupervisorServer;
use App\DTO\XmlRpc\CallDTO;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class SupervisorApiClientTest extends WebTestCase
{
    public function testMethodsImplementations(): void
    {
        $actualMethods = [
            'supervisor.addProcessGroup',
            'supervisor.clearAllProcessLogs',
            'supervisor.clearLog',
            'supervisor.clearProcessLog',
            'supervisor.clearProcessLogs',
            'supervisor.getAPIVersion',
            'supervisor.getAllConfigInfo',
            'supervisor.getAllProcessInfo',
            'supervisor.getIdentification',
            'supervisor.getPID',
            'supervisor.getProcessInfo',
            'supervisor.getState',
            'supervisor.getSupervisorVersion',
            'supervisor.getVersion',
            'supervisor.readLog',
            'supervisor.readMainLog',
            'supervisor.readProcessLog',
            'supervisor.readProcessStderrLog',
            'supervisor.readProcessStdoutLog',
            'supervisor.reloadConfig',
            'supervisor.removeProcessGroup',
            'supervisor.restart',
            'supervisor.sendProcessStdin',
            'supervisor.sendRemoteCommEvent',
            'supervisor.shutdown',
            'supervisor.signalAllProcesses',
            'supervisor.signalProcess',
            'supervisor.signalProcessGroup',
            'supervisor.startAllProcesses',
            'supervisor.startProcess',
            'supervisor.startProcessGroup',
            'supervisor.stopAllProcesses',
            'supervisor.stopProcess',
            'supervisor.stopProcessGroup',
            'supervisor.tailProcessLog',
            'supervisor.tailProcessStderrLog',
            'supervisor.tailProcessStdoutLog',
            'system.listMethods',
            'system.methodHelp',
            'system.methodSignature',
            'system.multicall',
            'twiddler.addProgramToGroup',
            'twiddler.getAPIVersion',
            'twiddler.getGroupNames',
            'twiddler.log',
            'twiddler.removeProcessFromGroup',
        ];

        $callFQN = CallDTO::class;
        $apiFQN = SupervisorApiClient::class;

        $problems = [];
        foreach ($actualMethods as $method) {
            $methodArr = explode('.', $method);
            $method = array_pop($methodArr);

            if (!method_exists($callFQN, $method)) {
                $problems[] = "Method $callFQN::$method not implemented";
                continue;
            }

            if (!method_exists($apiFQN, $method)) {
                $problems[] = "Method $apiFQN::$method not implemented";
            }
        }
        $this->assertSame([], $problems);
    }

    public function testProcessClonedAndRemovedSuccessfully(): void
    {
        /** @var SupervisorServer[] $servers */
        $servers = self::getContainer()->getParameter('supervisors_servers');

        $server = $servers[0];

        /** @var SupervisorApiClient $api */
        $api = self::getContainer()->get(SupervisorApiClient::class);

        /** @var string $group */
        $group = $api->getAllConfigInfo($server)[0]->group;
        $program = 'test'.time();

        $result1 = $api->cloneProcess($program, $group, $server);
        $result2 = $api->removeProcess($group, $program, $server);

        $this->assertTrue($result1->ok && $result2->ok);
    }
}
