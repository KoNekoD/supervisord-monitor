<?php

declare(strict_types=1);

namespace App\Service\Symfony;

use App\DTO\EnvVar\AppCredentialsItem;
use Closure;
use Symfony\Component\DependencyInjection\EnvVarProcessorInterface;
use Symfony\Component\Serializer\SerializerInterface;

final readonly class AppCredentialsEnvVarProcessor implements EnvVarProcessorInterface
{
    public function __construct(private SerializerInterface $serializer) {}

    public static function getProvidedTypes(): array
    {
        return [
            'appCredentials' => 'string',
        ];
    }

    /** @return array<string, AppCredentialsItem> */
    public function getEnv(string $prefix, string $name, Closure $getEnv): array
    {
        $data = $getEnv($name);

        $type = AppCredentialsItem::class.'[]';

        /** @var AppCredentialsItem[] $items */
        $items = $this->serializer->deserialize($data, $type, 'json');

        $result = [];

        foreach ($items as $item) {
            $pass = sprintf('%s:%s', $item->username, $item->password);

            $result[$pass] = $item;
        }

        return $result;
    }
}
