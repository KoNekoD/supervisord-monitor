<?php

declare(strict_types=1);

namespace App\Service\Symfony;

use App\DTO\EnvVar\AppCredentialsItem;
use Closure;
use Symfony\Component\DependencyInjection\EnvVarProcessorInterface;
use Symfony\Component\DependencyInjection\Exception\EnvNotFoundException;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Yaml\Yaml;

final readonly class AppCredentialsEnvVarProcessor implements EnvVarProcessorInterface
{
    public function __construct(private SerializerInterface&DenormalizerInterface $serializer) {}

    public static function getProvidedTypes(): array
    {
        return [
            'appCredentials' => 'string',
        ];
    }

    /** @return array<string, AppCredentialsItem> */
    public function getEnv(string $prefix, string $name, Closure $getEnv): array
    {
        $type = AppCredentialsItem::class.'[]';

        try {
            $data = $getEnv($name);

            /** @var AppCredentialsItem[] $items */
            $items = $this->serializer->deserialize($data, $type, 'json');
        } catch (EnvNotFoundException) {
            $data = Yaml::parseFile('/var/www/supervisord-monitor/config/app/app_credentials.yaml');
            $data = is_array($data) ? $data['app_credentials'] ?? [] : [];

            /** @var AppCredentialsItem[] $items */
            $items = $this->serializer->denormalize($data, $type, 'json');
        }

        $result = [];

        foreach ($items as $item) {
            $pass = sprintf('%s:%s', $item->username, $item->password);

            $result[$pass] = $item;
        }

        return $result;
    }
}
