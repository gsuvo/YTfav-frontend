import { Route } from "@angular/router";
import { VideoList } from './components/video-list/video-list';
import { VideoDetail } from './components/video-detail/video-detail';

export const videosRoutes: Route[] = [
    {path: 'videos', component: VideoList},
    {path: 'video/:id', component: VideoDetail}
];