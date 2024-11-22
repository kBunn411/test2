"use client";
import { RecipeResult } from '@/types/RecipeResponseType';
import { fetchRecipeByID } from '@/utils/fetchRecipes';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

declare global{
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export default function RecipeDetails() {
    const [recipe, setRecipe] = useState<RecipeResult>()
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    const recipeId = useParams().recipeid as string
    const [videoId, setVideoId] = useState<string | null>(null);//yt video ID
    const [playerReady, setPlayerReady] = useState<boolean>(false);//tracks if yt api is ready
    const playerRef = useRef<HTMLDivElement | null>(null);
    const [videoDetails, setVideoDetails] = useState<any>(null);


    console.log(recipeId)

    useEffect(() => {
        //fetch recipe details
        const fetchRecipeDetails = async()=>{
            const recipeResult = await fetchRecipeByID(recipeId);
            setRecipe(recipeResult);
            setLoading(false);
        };
        fetchRecipeDetails();
    }, [recipeId]);


    useEffect(() => {
        //load the yt IFrame Api
        const loadYoutubeAPI = () => {
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';//cifnrim the url since this is just from webstorm
            script.async = true;
            document.body.appendChild(script);

            window.onYouTubeIframeAPIReady = () =>{
                setPlayerReady(true);
            };
        };

        if (!window.YT){
            loadYoutubeAPI();
        } else{
            setPlayerReady(true);
        }
    }, []);

    const fetchVideo = async () => {
        if (!recipe || !recipe.label) return;

        const query = `${recipe.label} recipe`.trim();
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
            query
        )}&key=${apiKey}`;

        console.log("Line 66) YouTube API Request URL: ", url);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Line 73) YouTube API Error:", errorData, "Status Code:", response.status);
                return;
            }

            const data = await response.json();
            console.log("YouTube API Response:", data);

            if (data.items && data.items.length > 0) {
                const fetchedVideoId = data.items[0].id.videoId;
                console.log("Fetched video ID:", fetchedVideoId);
                setVideoId(fetchedVideoId);

                // Fetch additional details
                fetchVideoDetails(fetchedVideoId);
            } else {
                console.warn("No video found for query:", query);
                setVideoId(null);
            }
        } catch (error) {
            console.error("Error fetching YouTube video:", error);
        }
    };


    const fetchVideoDetails = async (videoId: string) => {
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("YouTube API Error (list):", errorData, "Status Code:", response.status);
                return;
            }

            const data = await response.json();
            console.log("YouTube Video Details:", data);

            if (data.items && data.items.length > 0) {
                setVideoDetails(data.items[0]); // Store the video details
            } else {
                console.warn("No details found for videoId:", videoId);
                setVideoDetails(null);
            }
        } catch (error) {
            console.error("Error fetching YouTube video details:", error);
            setVideoDetails(null);
        }
    };


    const playVideo = () => {
        if (!playerRef.current || !videoId || !playerReady) return;

        //dynamically make the yt player
        new window.YT.Player(playerRef.current, {
            height: '390',
            width: '640',
            videoId: videoId,
            playerVars: {
                playsinline: 1,
            },
            events: {
                onReady: (event: any) => {
                    event.target.playVideo();
                },
            },
        });
    };

    useEffect(() => {
        if (videoId){
            playVideo();
        }
    }, [videoId, playerReady]);


    //useEffect(() => {
      //  const effect = async () => {
        //    const recipeResult = await fetchRecipeByID(recipeId);
          //  setRecipe(recipeResult)
            //setLoading(false)
            //}
    
        //effect();
    //}, []);

    //not sure about best way to set this up
    //console.log(recipe)
    if (loading){return <div>RECIPE IS LOADING!!</div>}
    if (!recipe){return <div>No recipe Found</div>}

    return (
        <div style={{ color: "white", fontSize: "40", height: "20rem" }}>
            <img src={recipe.image} alt="RECIPE IMAGE" />
            <h1>{recipe.label}</h1>
            <button onClick={fetchVideo} style={{ margin: '10px', padding: '10px' }}>
                Watch A Sample Video
            </button>
            <div ref={playerRef} style={{ marginTop: '20px' }}>
                {!videoId && <p>Click the button to load a sample recipe video</p>}
            </div>
            {videoDetails && (
                <div style={{ marginTop: "20px" }}>
                    <h2>{videoDetails.snippet.title}</h2>
                    <p>{videoDetails.snippet.description}</p>
                    <img
                        src={videoDetails.snippet.thumbnails.medium.url}
                        alt="Video Thumbnail"
                        style={{ maxWidth: "100%" }}
                    />
                </div>
            )}
        </div>
    );
}
