<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\ScoreRepository;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(ScoreRepository $scoreRepository): Response
    {

        $scores = $scoreRepository->findAll();

        return $this->render('home/index.html.twig', [
            'scores' => $scores,
        ]);
    }
}