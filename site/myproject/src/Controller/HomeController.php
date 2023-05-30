<?php

namespace App\Controller;

use App\Form\PseudoFormType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\ScoreRepository;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(ScoreRepository $scoreRepository, Request $request): Response
    {

        $scores = $scoreRepository->findAll();

        $form = $this->createForm(PseudoFormType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Récupère le pseudo du formulaire
            $pseudo = $form->get('pseudo')->getData();

            // Redirige vers la page du jeu avec le pseudo comme paramètre
            return $this->redirectToRoute('game_start', ['pseudo' => $pseudo]);
        }

        return $this->render('home/index.html.twig', [
            'scores' => $scores,
            'form' => $form->createView(),
        ]);
    }
}
