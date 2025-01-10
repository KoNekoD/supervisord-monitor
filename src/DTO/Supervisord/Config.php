<?php

declare(strict_types=1);

namespace App\DTO\Supervisord;

use App\DTO\XmlRpc\ResponseDTO;
use App\Exception\XmlRpcException;
use JsonSerializable;

class Config implements JsonSerializable
{
    /** @param int[] $exitCodes */
    public function __construct(
        public ?bool $autoStart = null,
        public ?string $directory = null,
        public ?string $uid = null,
        public ?string $command = null,
        public ?array $exitCodes = null,
        public ?string $group = null,
        public ?int $groupPriority = null,
        public ?bool $inUse = null,
        public ?bool $killAsGroup = null,
        public ?string $name = null,
        public ?int $processPriority = null,
        public ?bool $redirectStderr = null,
        public ?int $startRetries = null,
        public ?int $startSeconds = null,
        public ?int $stdoutCaptureMaxBytes = null,
        public ?bool $stdoutEventsEnabled = null,
        public ?string $stdoutLogfile = null,
        public ?int $stdoutLogfileBackups = null,
        public ?int $stdoutLogfileMaxBytes = null,
        public ?bool $stdoutSyslog = null,
        public ?int $stopSignal = null,
        public ?int $stopWaitSeconds = null,
        public ?int $stderrCaptureMaxBytes = null,
        public ?bool $stderrEventsEnabled = null,
        public ?string $stderrLogfile = null,
        public ?int $stderrLogfileBackups = null,
        public ?int $stderrLogfileMaxBytes = null,
        public ?bool $stderrSyslog = null,
        public ?string $serverUrl = null,
    ) {}

    /** @return self[] */
    public static function fromResponseArray(ResponseDTO $response): array
    {
        $result = [];
        foreach ($response->array() as $i => $item) {
            if (!is_int($i)) {
                throw new XmlRpcException('Invalid response');
            }

            /** @var array<string, mixed> $item */
            $result[] = self::fromArray($item);
        }

        return $result;
    }

    /** @param array<string, mixed> $item */
    private static function fromArray(array $item): self
    {
        /** @var array{
         *      autostart: bool,
         *      directory: string,
         *      uid: string,
         *      command: string,
         *      exitcodes: int[],
         *      group: string,
         *      group_prio: int,
         *      inuse: bool,
         *      killasgroup: bool,
         *      name: string,
         *      process_prio: int,
         *      redirect_stderr: bool,
         *      startretries: int,
         *      startsecs: int,
         *      stdout_capture_maxbytes: int,
         *      stdout_events_enabled: bool,
         *      stdout_logfile: string,
         *      stdout_logfile_backups: int,
         *      stdout_logfile_maxbytes: int,
         *      stdout_syslog: bool,
         *      stopsignal: int,
         *      stopwaitsecs: int,
         *      stderr_capture_maxbytes: int,
         *      stderr_events_enabled: bool,
         *      stderr_logfile: string,
         *      stderr_logfile_backups: int,
         *      stderr_logfile_maxbytes: int,
         *      stderr_syslog: bool,
         *      serverurl: string,
         * } $item
         */
        return new self(
            autoStart: $item['autostart'],
            directory: $item['directory'],
            uid: $item['uid'],
            command: $item['command'],
            exitCodes: $item['exitcodes'],
            group: $item['group'],
            groupPriority: $item['group_prio'],
            inUse: $item['inuse'],
            killAsGroup: $item['killasgroup'],
            name: $item['name'],
            processPriority: $item['process_prio'],
            redirectStderr: $item['redirect_stderr'],
            startRetries: $item['startretries'],
            startSeconds: $item['startsecs'],
            stdoutCaptureMaxBytes: $item['stdout_capture_maxbytes'],
            stdoutEventsEnabled: $item['stdout_events_enabled'],
            stdoutLogfile: $item['stdout_logfile'],
            stdoutLogfileBackups: $item['stdout_logfile_backups'],
            stdoutLogfileMaxBytes: $item['stdout_logfile_maxbytes'],
            stdoutSyslog: $item['stdout_syslog'],
            stopSignal: $item['stopsignal'],
            stopWaitSeconds: $item['stopwaitsecs'],
            stderrCaptureMaxBytes: $item['stderr_capture_maxbytes'],
            stderrEventsEnabled: $item['stderr_events_enabled'],
            stderrLogfile: $item['stderr_logfile'],
            stderrLogfileBackups: $item['stderr_logfile_backups'],
            stderrLogfileMaxBytes: $item['stderr_logfile_maxbytes'],
            stderrSyslog: $item['stderr_syslog'],
            serverUrl: $item['serverurl'],
        );
    }

    /** @return array<string, string> */
    public function jsonSerialize(): array
    {
        $result = [];

        $autoStart = $this->autoStart;
        if ($autoStart) {
            $result['autostart'] = (string)$autoStart;
        }

        $directory = $this->directory;
        if ($directory && $directory !== 'none') {
            $result['directory'] = $directory;
        }

        $uid = $this->uid;
        if ($uid && $uid !== 'none') {
            $result['uid'] = $uid;
        }

        $command = $this->command;
        if ($command && $command !== 'none') {
            $result['command'] = $command;
        }

        $exitCodes = $this->exitCodes;
        if ($exitCodes) {
            $result['exitcodes'] = implode(',', $exitCodes);
        }

        $group = $this->group;
        if ($group && $group !== 'none') {
            $result['group'] = $group;
        }

        $groupPriority = $this->groupPriority;
        if ($groupPriority) {
            $result['group_prio'] = (string)$groupPriority;
        }

        $inUse = $this->inUse;
        if ($inUse) {
            $result['inuse'] = (string)$inUse;
        }

        $killAsGroup = $this->killAsGroup;
        if ($killAsGroup) {
            $result['killasgroup'] = (string)$killAsGroup;
        }

        $name = $this->name;
        if ($name && $name !== 'none') {
            $result['name'] = $name;
        }

        $processPriority = $this->processPriority;
        if ($processPriority) {
            $result['process_prio'] = (string)$processPriority;
        }

        $redirectStderr = $this->redirectStderr;
        if ($redirectStderr) {
            $result['redirect_stderr'] = (string)$redirectStderr;
        }

        $startRetries = $this->startRetries;
        if ($startRetries) {
            $result['startretries'] = (string)$startRetries;
        }

        $startSeconds = $this->startSeconds;
        if ($startSeconds) {
            $result['startsecs'] = (string)$startSeconds;
        }

        $stdoutCaptureMaxBytes = $this->stdoutCaptureMaxBytes;
        if ($stdoutCaptureMaxBytes) {
            $result['stdout_capture_maxbytes'] = (string)$stdoutCaptureMaxBytes;
        }

        $stdoutEventsEnabled = $this->stdoutEventsEnabled;
        if ($stdoutEventsEnabled) {
            $result['stdout_events_enabled'] = (string)$stdoutEventsEnabled;
        }

        $stdoutLogfile = $this->stdoutLogfile;
        if ($stdoutLogfile && $stdoutLogfile !== 'none') {
            $result['stdout_logfile'] = $stdoutLogfile;
        }

        $stdoutLogfileBackups = $this->stdoutLogfileBackups;
        if ($stdoutLogfileBackups) {
            $result['stdout_logfile_backups'] = (string)$stdoutLogfileBackups;
        }

        $stdoutLogfileMaxBytes = $this->stdoutLogfileMaxBytes;
        if ($stdoutLogfileMaxBytes) {
            $result['stdout_logfile_maxbytes'] = (string)$stdoutLogfileMaxBytes;
        }

        $stdoutSyslog = $this->stdoutSyslog;
        if ($stdoutSyslog) {
            $result['stdout_syslog'] = (string)$stdoutSyslog;
        }

        $stopSignal = $this->stopSignal;
        if ($stopSignal) {
            $result['stopsignal'] = (string)$stopSignal;
        }

        $stopWaitSeconds = $this->stopWaitSeconds;
        if ($stopWaitSeconds) {
            $result['stopwaitsecs'] = (string)$stopWaitSeconds;
        }

        $stderrCaptureMaxBytes = $this->stderrCaptureMaxBytes;
        if ($stderrCaptureMaxBytes) {
            $result['stderr_capture_maxbytes'] = (string)$stderrCaptureMaxBytes;
        }

        $stderrEventsEnabled = $this->stderrEventsEnabled;
        if ($stderrEventsEnabled) {
            $result['stderr_events_enabled'] = (string)$stderrEventsEnabled;
        }

        $stderrLogfile = $this->stderrLogfile;
        if ($stderrLogfile && $stderrLogfile !== 'none') {
            $result['stderr_logfile'] = $stderrLogfile;
        }

        $stderrLogfileBackups = $this->stderrLogfileBackups;
        if ($stderrLogfileBackups) {
            $result['stderr_logfile_backups'] = (string)$stderrLogfileBackups;
        }

        $stderrLogfileMaxBytes = $this->stderrLogfileMaxBytes;
        if ($stderrLogfileMaxBytes) {
            $result['stderr_logfile_maxbytes'] = (string)$stderrLogfileMaxBytes;
        }

        $stderrSyslog = $this->stderrSyslog;
        if ($stderrSyslog) {
            $result['stderr_syslog'] = (string)$stderrSyslog;
        }

        $serverUrl = $this->serverUrl;
        if ($serverUrl && $serverUrl !== 'none') {
            $result['serverurl'] = $serverUrl;
        }

        $result['autorestart'] = 'unexpected';

        return $result;
    }
}
