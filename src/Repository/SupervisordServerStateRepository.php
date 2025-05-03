<?php
declare(strict_types=1);

namespace App\Repository;

use App\Entity\SupervisordServerState;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method SupervisordServerState|null find($id, $lockMode = null, $lockVersion = null)
 * @method SupervisordServerState|null findOneBy(array $criteria, ?array $orderBy = null)
 * @method SupervisordServerState[] findAll()
 * @method SupervisordServerState[] findBy(array $criteria, ?array $orderBy = null, $limit = null, $offset = null)
 */
class SupervisordServerStateRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SupervisordServerState::class);
    }
}
