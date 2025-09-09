import java.util.ArrayList;
import java.util.List;

public class PostService {
    private PostRepo postRepo;
    private UserRepo userRepo;
    private List<PostObserver> observers = new ArrayList<>();

    public PostService(UserRepo userRepo, PostRepo postRepo) {
        this.userRepo = userRepo;
        this.postRepo = postRepo;
    }

    public Post createPost(String userId, String content) {
        User user = userRepo.findById(userId);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        Post post = new Post(userId, content);
        postRepo.save(post);

        for(String followerId: user.getFriends()) {
            notifyObservers(followerId, post);
        }

        return post;
    }

    public void registerObserver(PostObserver observer) {
        observers.add(observer);
    }

    public void notifyObservers(String targetUserId, Post post) {
        for (PostObserver observer : observers) {
            observer.update(targetUserId, post);
        }
    }
}
