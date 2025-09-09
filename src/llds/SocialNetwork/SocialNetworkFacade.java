import java.util.List;
import java.util.UUID;

public class SocialNetworkFacade {
    private UserRepo userRepo = UserRepo.getInstance();
    private PostRepo postRepo = PostRepo.getInstance();
    private PostService postService;
    private PostFeedService postFeedService;

    public SocialNetworkFacade() {
        postFeedService = new PostFeedService();
        postService = new PostService(userRepo, postRepo);
        postService.registerObserver(new PostFeedNotifier(postFeedService));
    }

    public User createUser(String name) {
        String userId = UUID.randomUUID().toString();
        User user = new User(userId, name);
        userRepo.save(user);
        return user;
    }

    public void addFriend(User user, String friendId) {
        User friend = userRepo.findById(friendId);
        if (friend != null) {
            user.addFriend(friendId);
            friend.addFriend(user.getUserId());
        }
    }

    public Post createPost(String userId, String content) {
        return postService.createPost(userId, content);
    }

    public List<Post> getFeed(String userId) {
        return postFeedService.getPostFeed(userId);
    }
}
