<?php


namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class StoreFileController
 * @package App\Controller
 */
class PhotoFileController extends AbstractController
{

    /**
     * @Route("/uploads")
     * @param Request $request
     * @return JsonResponse|Response
     */
    public function savePhotoFile(Request $request)
    {
        if ($request->files) {
            $file = $request->files->get('file');
            $fileName = $request->get('filename');

            $file->move(
                $this->getParameter('photos_directory'),
                $fileName
            );

            return new JsonResponse($fileName);
        }

        return new Response('Request went bad', 400);
    }

    /**
     * @Route("/photo/{filename}")
     * @param string $filename
     * @param Request $request
     * @return String
     */
    public function showPhoto(Request $request, string $filename)
    {
        $filepath = $this->getParameter('photos_directory')."/".$filename;
        $response = new Response();
        $disposition = $response->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_INLINE, $filename);
        $response->headers->set('Content-Disposition', $disposition);
        $response->headers->set('Content-Type', 'image');
        $response->setContent(file_get_contents($filepath));
        return $response;
    }
}
