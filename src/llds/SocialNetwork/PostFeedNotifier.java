public class PostFeedNotifier implements PostObserver {
    private PostFeedService postFeedService;
    
    public PostFeedNotifier(PostFeedService postFeedService) {
        this.postFeedService = postFeedService;
    }

    public void update(String targetUserId, Post post) {
        postFeedService.addPostToUserFeed(targetUserId, post);
    }
    
}
