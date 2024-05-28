<?php

declare(strict_types=1);

namespace App\DTO\Output;

use Riverwaysoft\PhpConverter\Filter\Attributes\Dto;

#[Dto]
class ProcessInfoDTO
{
    public ?ProcessLogDTO $errLog = null;
    public ?ProcessLogDTO $outLog = null;

    public string $descPid = '';
    public string $descUptime = '';

    public function __construct(
        public string $name,
        public string $group,
        public int $start,
        public int $stop,
        public int $now,
        public int $state,
        public string $stateName,
        public string $spawnErr,
        public int $exitStatus,
        public string $logfile,
        public string $stdoutLogfile,
        public string $stderrLogfile,
        public int $pid,
        public string $description,
    ) {
        $explodedDesc = explode(",", $this->description);
        if (count($explodedDesc) == 2) {
            [$this->descPid, $uptime] = $explodedDesc;
            $uptime = str_replace("uptime ", "", $uptime);
            $this->descUptime = $uptime;
        }
    }

    /**
     * @param array<string, int|string> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: (string)$data['name'],
            group: (string)$data['group'],
            start: (int)$data['start'],
            stop: (int)$data['stop'],
            now: (int)$data['now'],
            state: (int)$data['state'],
            stateName: (string)$data['statename'],
            spawnErr: (string)$data['spawnerr'],
            exitStatus: (int)$data['exitstatus'],
            logfile: (string)$data['logfile'],
            stdoutLogfile: (string)$data['stdout_logfile'],
            stderrLogfile: (string)$data['stderr_logfile'],
            pid: (int)$data['pid'],
            description: (string)$data['description'],
        );
    }

    public function getFullProcessName(): string
    {
        return $this->group.':'.$this->name;
    }
}
