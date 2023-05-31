<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GameController extends AbstractController
{
    #[Route('/game/{pseudo}', name: 'game_start')]
    public function index(string $pseudo): Response
    {
        if ($pseudo === null) {
            return $this->redirectToRoute('app_home');
        }

        return $this->render('game/index.html.twig', [
            'pseudo' => $pseudo,
        ]);
    }
}
