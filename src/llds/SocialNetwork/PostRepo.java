import java.util.HashMap;
import java.util.Map;

public class PostRepo {
    String postId;
    private static PostRepo instance;
    private Map<String, Post> posts = new HashMap<>();

    private PostRepo () {};

    public static synchronized PostRepo getInstance() {
        if (instance == null) {
            instance = new PostRepo();
        }
        return instance;
    }

    public void save(Post post) {
        posts.put(post.getPostId(), post);
    }

    public Post findById(String postId) {
        return posts.get(postId);
    }
}
