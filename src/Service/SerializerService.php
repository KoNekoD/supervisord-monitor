<?php

declare(strict_types=1);

namespace App\Service;

use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\SerializerInterface;

final readonly class SerializerService
{
    public function __construct(
        private SerializerInterface $serializer,
        private NormalizerInterface $normalizer,
        private DenormalizerInterface $denormalizer
    ) {}

    /**
     * @template T
     *
     * @param T $data
     */
    public function serialize(mixed $data, string $format = 'json'): string
    {
        return $this->serializer->serialize(
            $data,
            $format,
            [
                AbstractNormalizer::IGNORED_ATTRIBUTES => [
                    '__initializer__',
                    '__cloner__',
                    '__isInitialized__',
                ],
            ]
        );
    }

    /**
     * @template T
     *
     * @param class-string<T> $type
     *
     * @return T
     */
    public function deserialize(
        mixed $data,
        string $type,
        string $format = 'json'
    ): mixed {
        return $this->serializer->deserialize($data, $type, $format);
    }

    /**
     * @template T
     *
     * @param T $data
     *
     * @return array<T>
     *
     * @throws ExceptionInterface
     */
    public function normalize(mixed $data): mixed
    {
        /* @phpstan-ignore-next-line */
        return $this->normalizer->normalize(
            $data,
            null,
            [
                AbstractNormalizer::IGNORED_ATTRIBUTES => [
                    '__initializer__',
                    '__cloner__',
                    '__isInitialized__',
                ],
            ]
        );
    }

    /**
     * @template T
     * @template T2
     *
     * @param T $data
     * @param class-string<T2> $type
     *
     * @return T2
     * @throws ExceptionInterface
     */
    public function denormalize(
        mixed $data,
        string $type,
        ?string $format = null
    ): mixed {
        return $this->denormalizer->denormalize($data, $type, $format);
    }
}
