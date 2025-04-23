import { 
  users, User, InsertUser,
  apps, App, InsertApp,
  githubRepos, GithubRepo, InsertGithubRepo,
  blogPosts, BlogPost, InsertBlogPost,
  contactMessages, ContactMessage, InsertContactMessage,
  codeSamples, CodeSample, InsertCodeSample
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // App operations
  getAllApps(): Promise<App[]>;
  getApp(id: number): Promise<App | undefined>;
  createApp(app: InsertApp): Promise<App>;
  
  // GitHub Repo operations
  getAllGithubRepos(): Promise<GithubRepo[]>;
  getGithubRepo(id: number): Promise<GithubRepo | undefined>;
  createGithubRepo(repo: InsertGithubRepo): Promise<GithubRepo>;
  
  // Blog Post operations
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getFeaturedBlogPost(): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Contact Message operations
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // Code Sample operations
  getAllCodeSamples(): Promise<CodeSample[]>;
  getCodeSample(id: number): Promise<CodeSample | undefined>;
  createCodeSample(sample: InsertCodeSample): Promise<CodeSample>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private apps: Map<number, App>;
  private githubRepos: Map<number, GithubRepo>;
  private blogPosts: Map<number, BlogPost>;
  private contactMessages: Map<number, ContactMessage>;
  private codeSamples: Map<number, CodeSample>;
  
  private userCurrentId: number;
  private appCurrentId: number;
  private repoCurrentId: number;
  private postCurrentId: number;
  private messageCurrentId: number;
  private sampleCurrentId: number;

  constructor() {
    this.users = new Map();
    this.apps = new Map();
    this.githubRepos = new Map();
    this.blogPosts = new Map();
    this.contactMessages = new Map();
    this.codeSamples = new Map();
    
    this.userCurrentId = 1;
    this.appCurrentId = 1;
    this.repoCurrentId = 1;
    this.postCurrentId = 1;
    this.messageCurrentId = 1;
    this.sampleCurrentId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // App operations
  async getAllApps(): Promise<App[]> {
    return Array.from(this.apps.values());
  }
  
  async getApp(id: number): Promise<App | undefined> {
    return this.apps.get(id);
  }
  
  async createApp(insertApp: InsertApp): Promise<App> {
    const id = this.appCurrentId++;
    // Make sure all required fields are non-undefined
    const app: App = {
      ...insertApp,
      id,
      rating: insertApp.rating ?? null,
      downloads: insertApp.downloads ?? null,
      githubUrl: insertApp.githubUrl ?? null,
      playStoreUrl: insertApp.playStoreUrl ?? null,
    };
    this.apps.set(id, app);
    return app;
  }
  
  // GitHub Repo operations
  async getAllGithubRepos(): Promise<GithubRepo[]> {
    return Array.from(this.githubRepos.values());
  }
  
  async getGithubRepo(id: number): Promise<GithubRepo | undefined> {
    return this.githubRepos.get(id);
  }
  
  async createGithubRepo(insertRepo: InsertGithubRepo): Promise<GithubRepo> {
    const id = this.repoCurrentId++;
    const repo: GithubRepo = { ...insertRepo, id };
    this.githubRepos.set(id, repo);
    return repo;
  }
  
  // Blog Post operations
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug,
    );
  }
  
  async getFeaturedBlogPost(): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.isFeatured === true,
    );
  }
  
  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.postCurrentId++;
    // Make sure isFeatured is non-undefined
    const post: BlogPost = {
      ...insertPost,
      id,
      isFeatured: insertPost.isFeatured ?? false
    };
    this.blogPosts.set(id, post);
    return post;
  }
  
  // Contact Message operations
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }
  
  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }
  
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.messageCurrentId++;
    const now = new Date();
    const message: ContactMessage = { ...insertMessage, id, createdAt: now };
    this.contactMessages.set(id, message);
    return message;
  }
  
  // Code Sample operations
  async getAllCodeSamples(): Promise<CodeSample[]> {
    return Array.from(this.codeSamples.values());
  }
  
  async getCodeSample(id: number): Promise<CodeSample | undefined> {
    return this.codeSamples.get(id);
  }
  
  async createCodeSample(insertSample: InsertCodeSample): Promise<CodeSample> {
    const id = this.sampleCurrentId++;
    const sample: CodeSample = { ...insertSample, id };
    this.codeSamples.set(id, sample);
    return sample;
  }

  // Initialize with sample data
  private initializeData() {
    // Add sample Android apps
    this.createApp({
      title: "TaskMaster Pro",
      description: "A productivity app for managing tasks, projects, and deadlines with smart notifications and analytics.",
      image: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&w=600&h=400&q=80",
      rating: "4.7 ★",
      category: "Productivity",
      downloads: "100K+ Downloads",
      githubUrl: "https://github.com/johndoe/taskmaster-pro",
      playStoreUrl: "https://play.google.com",
    });

    this.createApp({
      title: "FitTrack",
      description: "A comprehensive fitness tracking app with workout plans, meal tracking, and progress visualization.",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&h=400&q=80",
      rating: "4.8 ★",
      category: "Health & Fitness",
      downloads: "500K+ Downloads",
      githubUrl: "https://github.com/johndoe/fittrack",
      playStoreUrl: "https://play.google.com",
    });

    this.createApp({
      title: "CryptoWatch",
      description: "Real-time cryptocurrency tracking with price alerts, portfolio management, and market analysis.",
      image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=600&h=400&q=80",
      rating: "4.5 ★",
      category: "Finance",
      downloads: "250K+ Downloads",
      githubUrl: "https://github.com/johndoe/cryptowatch",
      playStoreUrl: "https://play.google.com",
    });

    this.createApp({
      title: "WeatherNow",
      description: "Accurate weather forecasts with beautiful visualizations, radar maps, and severe weather alerts.",
      image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&h=400&q=80",
      rating: "4.6 ★",
      category: "Weather",
      downloads: "1M+ Downloads",
      githubUrl: "https://github.com/johndoe/weathernow",
      playStoreUrl: "https://play.google.com",
    });

    this.createApp({
      title: "City Guide",
      description: "Local discovery app with curated recommendations for restaurants, events, and attractions.",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&h=400&q=80",
      rating: "4.4 ★",
      category: "Travel & Local",
      downloads: "300K+ Downloads",
      githubUrl: "https://github.com/johndoe/city-guide",
      playStoreUrl: "https://play.google.com",
    });

    this.createApp({
      title: "CodeHub",
      description: "Mobile coding environment with syntax highlighting, GitHub integration, and code sharing.",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&h=400&q=80",
      rating: "4.9 ★",
      category: "Developer Tools",
      downloads: "150K+ Downloads",
      githubUrl: "https://github.com/johndoe/codehub",
      playStoreUrl: "https://play.google.com",
    });

    // Add sample GitHub repos
    this.createGithubRepo({
      name: "android-clean-architecture-boilerplate",
      description: "A starter template implementing Clean Architecture principles for Android projects with MVVM, Coroutines, and Dagger.",
      stars: 1200,
      forks: 340,
      url: "https://github.com/johndoe/android-clean-architecture-boilerplate",
      tags: ["Kotlin", "Architecture", "Template"],
    });

    this.createGithubRepo({
      name: "compose-ui-components",
      description: "A collection of reusable UI components built with Jetpack Compose, focusing on animations and Material Design 3.",
      stars: 843,
      forks: 215,
      url: "https://github.com/johndoe/compose-ui-components",
      tags: ["Jetpack Compose", "UI", "Library"],
    });

    // Add sample blog posts
    this.createBlogPost({
      title: "Building Modern UIs with Jetpack Compose",
      slug: "building-modern-uis-with-jetpack-compose",
      summary: "A comprehensive guide to getting started with Jetpack Compose, covering the basics, state management, and animations.",
      content: `
        <h2>Introduction to Jetpack Compose</h2>
        <p>Jetpack Compose is Android's modern toolkit for building native UI. It simplifies and accelerates UI development on Android with less code, powerful tools, and intuitive Kotlin APIs.</p>
        
        <h2>Getting Started</h2>
        <p>To start using Jetpack Compose, you need to add the following dependencies to your project:</p>
        
        <pre><code>
        dependencies {
            implementation "androidx.compose.ui:ui:1.0.0"
            implementation "androidx.compose.material:material:1.0.0"
            implementation "androidx.compose.ui:ui-tooling:1.0.0"
        }
        </code></pre>
        
        <h2>Basic Composables</h2>
        <p>Composables are the building blocks of your UI in Compose. They are functions annotated with @Composable that can emit UI elements.</p>
        
        <pre><code>
        @Composable
        fun Greeting(name: String) {
            Text(text = "Hello $name!")
        }
        </code></pre>
        
        <h2>State Management</h2>
        <p>State in Compose is handled using the remember and mutableStateOf functions, which create a memory-backed storage that survives recomposition.</p>
        
        <pre><code>
        @Composable
        fun Counter() {
            var count by remember { mutableStateOf(0) }
            
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(text = "Count: $count")
                Button(onClick = { count++ }) {
                    Text("Increment")
                }
            }
        }
        </code></pre>
        
        <h2>Animations</h2>
        <p>Compose provides a powerful animation API that makes it easy to add motion to your UI.</p>
        
        <pre><code>
        @Composable
        fun AnimatedCounter() {
            var count by remember { mutableStateOf(0) }
            val animatedCount by animateIntAsState(targetValue = count)
            
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(text = "Count: $animatedCount")
                Button(onClick = { count++ }) {
                    Text("Increment")
                }
            }
        }
        </code></pre>
        
        <h2>Conclusion</h2>
        <p>Jetpack Compose offers a modern, declarative way to build UIs on Android. It simplifies complex UI tasks and integrates well with existing code. As it continues to evolve, it's becoming the standard for Android UI development.</p>
      `,
      image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&h=300&q=80",
      publishedAt: new Date("2023-06-15"),
      readTime: 8,
      isFeatured: false,
      tags: ["Jetpack Compose", "UI", "Tutorial"],
    });

    this.createBlogPost({
      title: "Optimizing Android App Performance",
      slug: "optimizing-android-app-performance",
      summary: "Techniques and best practices for optimizing your Android app's performance, from startup time to smooth scrolling.",
      content: `
        <h2>Why Performance Matters</h2>
        <p>Performance is a critical aspect of Android app development that directly impacts user experience. Slow, unresponsive apps lead to poor user reviews and high uninstall rates.</p>
        
        <h2>Measuring Performance</h2>
        <p>Before optimizing, it's essential to measure your app's current performance. Android Studio provides several tools for this:</p>
        <ul>
          <li>Profiler - for CPU, memory, and network usage</li>
          <li>Layout Inspector - for analyzing UI hierarchies</li>
          <li>Systrace - for examining system-wide performance</li>
        </ul>
        
        <h2>Optimizing Startup Time</h2>
        <p>App startup time is crucial for user retention. Here are some ways to improve it:</p>
        <ul>
          <li>Implement lazy initialization for heavy components</li>
          <li>Use Kotlin coroutines for asynchronous loading</li>
          <li>Consider using App Startup library for initializing components</li>
        </ul>
        
        <pre><code>
        class MyApplication : Application() {
            override fun onCreate() {
                super.onCreate()
                // Instead of initializing everything here...
                
                // Launch initialization in a background thread
                CoroutineScope(Dispatchers.IO).launch {
                    // Initialize components that aren't needed immediately
                    initializeAnalytics()
                    initializeImageLoader()
                }
            }
        }
        </code></pre>
        
        <h2>Optimizing UI Performance</h2>
        <p>Smooth UI is essential for a good user experience. Here are some tips:</p>
        <ul>
          <li>Flatten your view hierarchy and use ConstraintLayout</li>
          <li>Implement efficient RecyclerView adapters with DiffUtil</li>
          <li>Avoid expensive operations on the main thread</li>
        </ul>
        
        <pre><code>
        class MyAdapter : RecyclerView.Adapter<MyViewHolder>() {
            private val items = mutableListOf<Item>()
            
            fun updateItems(newItems: List<Item>) {
                val diffCallback = MyDiffCallback(items, newItems)
                val diffResult = DiffUtil.calculateDiff(diffCallback)
                
                items.clear()
                items.addAll(newItems)
                diffResult.dispatchUpdatesTo(this)
            }
            
            // Rest of adapter implementation
        }
        </code></pre>
        
        <h2>Memory Management</h2>
        <p>Proper memory management prevents crashes and ANRs (Application Not Responding):</p>
        <ul>
          <li>Avoid memory leaks by correctly handling lifecycle and context</li>
          <li>Use WeakReferences when appropriate</li>
          <li>Implement proper image loading and caching</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Performance optimization is an ongoing process. Regularly measure your app's performance and make incremental improvements. Remember that performance impacts user experience, which in turn affects retention and engagement.</p>
      `,
      image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=600&h=300&q=80",
      publishedAt: new Date("2023-05-28"),
      readTime: 12,
      isFeatured: false,
      tags: ["Performance", "Optimization", "Best Practices"],
    });

    this.createBlogPost({
      title: "Mastering Kotlin Coroutines for Android",
      slug: "mastering-kotlin-coroutines-for-android",
      summary: "An in-depth look at Kotlin Coroutines and Flow, with practical examples for handling asynchronous operations.",
      content: `
        <h2>Introduction to Coroutines</h2>
        <p>Kotlin Coroutines are a powerful way to write asynchronous, non-blocking code in a sequential manner. They simplify code that would otherwise be complex with callbacks or reactive streams.</p>
        
        <h2>Setting Up Coroutines</h2>
        <p>To use coroutines in your Android project, add the necessary dependencies:</p>
        
        <pre><code>
        dependencies {
            implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.0"
            implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.0"
            implementation "androidx.lifecycle:lifecycle-viewmodel-ktx:2.5.0"
            implementation "androidx.lifecycle:lifecycle-runtime-ktx:2.5.0"
        }
        </code></pre>
        
        <h2>Basic Coroutine Concepts</h2>
        <p>Understanding these basic concepts is essential for working with coroutines:</p>
        <ul>
          <li><strong>CoroutineScope</strong>: Defines the lifetime of coroutines</li>
          <li><strong>CoroutineContext</strong>: Contains coroutine configuration</li>
          <li><strong>Dispatchers</strong>: Determine which thread the coroutine runs on</li>
          <li><strong>Job</strong>: Represents a cancellable operation</li>
        </ul>
        
        <h2>Coroutines in Android</h2>
        <p>Android provides several convenient ways to use coroutines with lifecycle components:</p>
        
        <pre><code>
        class MyViewModel : ViewModel() {
            // Define a coroutine scope that's tied to the ViewModel's lifecycle
            private val viewModelScope = CoroutineScope(Dispatchers.Main + SupervisorJob())
            
            fun loadData() {
                viewModelScope.launch {
                    // Main thread - UI operations
                    showLoading()
                    
                    // Switch to IO dispatcher for network/database operations
                    val result = withContext(Dispatchers.IO) {
                        repository.fetchData()
                    }
                    
                    // Back on Main thread
                    hideLoading()
                    displayResult(result)
                }
            }
            
            override fun onCleared() {
                super.onCleared()
                viewModelScope.cancel() // Cancel all coroutines when ViewModel is cleared
            }
        }
        </code></pre>
        
        <h2>Introduction to Flow</h2>
        <p>Flow is a coroutine-based API for handling streams of data asynchronously:</p>
        
        <pre><code>
        class UserRepository(private val api: UserApi, private val dao: UserDao) {
            fun getUserUpdates(userId: String): Flow<User> = flow {
                while(true) {
                    val user = api.fetchUser(userId)
                    emit(user) // Emit the user to the flow
                    delay(60000) // Wait for 1 minute before fetching again
                }
            }
        }
        
        class UserViewModel(private val repository: UserRepository) : ViewModel() {
            private val _userState = MutableStateFlow<User?>(null)
            val userState: StateFlow<User?> = _userState
            
            fun observeUser(userId: String) {
                viewModelScope.launch {
                    repository.getUserUpdates(userId)
                        .collect { user ->
                            _userState.value = user
                        }
                }
            }
        }
        </code></pre>
        
        <h2>Error Handling in Coroutines</h2>
        <p>Proper error handling is crucial for robust applications:</p>
        
        <pre><code>
        viewModelScope.launch {
            try {
                val result = withContext(Dispatchers.IO) {
                    repository.riskyOperation()
                }
                processResult(result)
            } catch (e: Exception) {
                when (e) {
                    is IOException -> handleNetworkError(e)
                    is HttpException -> handleApiError(e)
                    else -> handleUnexpectedError(e)
                }
            } finally {
                hideLoading()
            }
        }
        </code></pre>
        
        <h2>Testing Coroutines</h2>
        <p>Coroutines can be tested using TestCoroutineDispatcher and runBlockingTest:</p>
        
        <pre><code>
        @Test
        fun \`fetch data returns success\`() = runBlockingTest {
            // Given
            val repository = FakeRepository()
            val viewModel = MyViewModel(repository)
            
            // When
            viewModel.fetchData()
            
            // Then
            assertEquals(DataState.Success, viewModel.dataState.value)
        }
        </code></pre>
        
        <h2>Conclusion</h2>
        <p>Kotlin Coroutines and Flow provide powerful tools for handling asynchronous operations in Android applications. They simplify complex asynchronous code while offering fine-grained control over execution and cancellation.</p>
      `,
      image: "https://images.unsplash.com/photo-1526570207772-784d36084510?auto=format&fit=crop&w=600&h=300&q=80",
      publishedAt: new Date("2023-04-10"),
      readTime: 10,
      isFeatured: false,
      tags: ["Kotlin", "Coroutines", "Async"],
    });

    this.createBlogPost({
      title: "Modern Android Architecture: A Deep Dive",
      slug: "modern-android-architecture-deep-dive",
      summary: "Exploring the latest architectural patterns in Android development, including MVVM, MVI, and Clean Architecture. Learn how to structure your app for maintainability, testability, and scalability.",
      content: `
        <h2>Evolution of Android Architecture</h2>
        <p>Android architecture patterns have evolved significantly over the years, from the early days of putting everything in Activities and Fragments to today's more sophisticated approaches. Let's explore the modern architectural patterns that help developers build robust, maintainable applications.</p>
        
        <h2>The Problem with Traditional Approaches</h2>
        <p>Traditional Android development often led to these issues:</p>
        <ul>
          <li>Massive Activity/Fragment classes (God objects)</li>
          <li>Tight coupling between UI and business logic</li>
          <li>Difficult to test components</li>
          <li>Poor separation of concerns</li>
          <li>Challenging to maintain as the app grows</li>
        </ul>
        
        <h2>Model-View-ViewModel (MVVM)</h2>
        <p>MVVM has become one of the most popular architectural patterns for Android development, especially with Google's introduction of Architecture Components.</p>
        
        <h3>Components of MVVM</h3>
        <ul>
          <li><strong>Model</strong>: Represents the data and business logic of the application</li>
          <li><strong>View</strong>: The UI layer (Activities, Fragments) that displays data and sends user actions to the ViewModel</li>
          <li><strong>ViewModel</strong>: Acts as a bridge between the Model and View, handling UI-related data logic and state</li>
        </ul>
        
        <pre><code>
        class UserViewModel(private val repository: UserRepository) : ViewModel() {
            private val _user = MutableLiveData<User>()
            val user: LiveData<User> = _user
            
            private val _loading = MutableLiveData<Boolean>()
            val loading: LiveData<Boolean> = _loading
            
            fun loadUser(userId: String) {
                viewModelScope.launch {
                    _loading.value = true
                    try {
                        _user.value = repository.getUser(userId)
                    } catch (e: Exception) {
                        // Handle error
                    } finally {
                        _loading.value = false
                    }
                }
            }
        }
        </code></pre>
        
        <h2>Model-View-Intent (MVI)</h2>
        <p>MVI is a more recent architectural pattern that emphasizes unidirectional data flow and immutable state.</p>
        
        <h3>Components of MVI</h3>
        <ul>
          <li><strong>Model</strong>: Represents state, which is immutable</li>
          <li><strong>View</strong>: Renders state and sends user intents to the Intent processor</li>
          <li><strong>Intent</strong>: Represents an intention to change the state</li>
        </ul>
        
        <pre><code>
        // State
        data class UserState(
            val user: User? = null,
            val isLoading: Boolean = false,
            val error: String? = null
        )
        
        // Intent
        sealed class UserIntent {
            data class LoadUser(val userId: String) : UserIntent()
            object RefreshUser : UserIntent()
        }
        
        // ViewModel
        class UserViewModel(private val repository: UserRepository) : ViewModel() {
            private val _state = MutableStateFlow(UserState())
            val state: StateFlow<UserState> = _state
            
            fun processIntent(intent: UserIntent) {
                when (intent) {
                    is UserIntent.LoadUser -> loadUser(intent.userId)
                    is UserIntent.RefreshUser -> refreshUser()
                }
            }
            
            private fun loadUser(userId: String) {
                viewModelScope.launch {
                    _state.value = _state.value.copy(isLoading = true, error = null)
                    try {
                        val user = repository.getUser(userId)
                        _state.value = _state.value.copy(user = user, isLoading = false)
                    } catch (e: Exception) {
                        _state.value = _state.value.copy(
                            isLoading = false, 
                            error = e.message
                        )
                    }
                }
            }
            
            private fun refreshUser() {
                viewModelScope.launch {
                    val currentUser = _state.value.user ?: return@launch
                    _state.value = _state.value.copy(isLoading = true, error = null)
                    try {
                        val updatedUser = repository.refreshUser(currentUser.id)
                        _state.value = _state.value.copy(user = updatedUser, isLoading = false)
                    } catch (e: Exception) {
                        _state.value = _state.value.copy(
                            isLoading = false, 
                            error = e.message
                        )
                    }
                }
            }
        }
        </code></pre>
        
        <h2>Clean Architecture</h2>
        <p>Clean Architecture focuses on separation of concerns by dividing the app into layers with clear dependencies:</p>
        
        <h3>Layers of Clean Architecture</h3>
        <ul>
          <li><strong>Domain Layer</strong>: Contains business logic and use cases</li>
          <li><strong>Data Layer</strong>: Handles data operations, repositories, and data sources</li>
          <li><strong>Presentation Layer</strong>: UI components and ViewModels</li>
        </ul>
        
        <pre><code>
        // Domain Layer - Use Case
        class GetUserUseCase(private val repository: UserRepository) {
            suspend operator fun invoke(userId: String): Result<User> {
                return try {
                    Result.success(repository.getUser(userId))
                } catch (e: Exception) {
                    Result.failure(e)
                }
            }
        }
        
        // Data Layer - Repository
        interface UserRepository {
            suspend fun getUser(userId: String): User
        }
        
        class UserRepositoryImpl(
            private val remoteDataSource: UserRemoteDataSource,
            private val localDataSource: UserLocalDataSource
        ) : UserRepository {
            override suspend fun getUser(userId: String): User {
                return try {
                    val user = remoteDataSource.getUser(userId)
                    localDataSource.saveUser(user)
                    user
                } catch (e: Exception) {
                    localDataSource.getUser(userId) ?: throw e
                }
            }
        }
        
        // Presentation Layer - ViewModel
        class UserViewModel(private val getUserUseCase: GetUserUseCase) : ViewModel() {
            private val _userState = MutableStateFlow<UserState>(UserState.Loading)
            val userState: StateFlow<UserState> = _userState
            
            fun loadUser(userId: String) {
                viewModelScope.launch {
                    _userState.value = UserState.Loading
                    getUserUseCase(userId).fold(
                        onSuccess = { user ->
                            _userState.value = UserState.Success(user)
                        },
                        onFailure = { error ->
                            _userState.value = UserState.Error(error.message ?: "Unknown error")
                        }
                    )
                }
            }
        }
        
        sealed class UserState {
            object Loading : UserState()
            data class Success(val user: User) : UserState()
            data class Error(val message: String) : UserState()
        }
        </code></pre>
        
        <h2>Jetpack Compose and Architecture</h2>
        <p>With the introduction of Jetpack Compose, the architecture patterns are evolving to better fit a declarative UI model:</p>
        
        <pre><code>
        @Composable
        fun UserScreen(
            viewModel: UserViewModel = viewModel(),
            userId: String
        ) {
            val userState by viewModel.userState.collectAsState()
            
            LaunchedEffect(userId) {
                viewModel.loadUser(userId)
            }
            
            when (val state = userState) {
                is UserState.Loading -> LoadingIndicator()
                is UserState.Success -> UserContent(user = state.user)
                is UserState.Error -> ErrorMessage(message = state.message)
            }
        }
        </code></pre>
        
        <h2>Testing Considerations</h2>
        <p>Well-architected applications are easier to test. Here are some tips for testing different components:</p>
        
        <ul>
          <li><strong>ViewModel Testing</strong>: Use TestCoroutineDispatcher and mock dependencies</li>
          <li><strong>Repository Testing</strong>: Mock data sources to test each layer in isolation</li>
          <li><strong>UI Testing</strong>: Use Espresso or Compose UI testing</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Modern Android architecture is about finding the right balance between separation of concerns, testability, and development speed. MVVM offers a good starting point, MVI provides stronger guarantees about state consistency, and Clean Architecture offers robust separation of concerns for larger projects.</p>
        
        <p>The best approach depends on your project's specific needs, your team's expertise, and the complexity of your application. Regardless of which pattern you choose, following these architectural principles will lead to more maintainable and reliable Android applications.</p>
      `,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&h=600&q=80",
      publishedAt: new Date("2023-03-25"),
      readTime: 15,
      isFeatured: true,
      tags: ["Architecture", "MVVM", "Clean Architecture"],
    });

    // Add sample code snippets
    this.createCodeSample({
      title: "Kotlin Flow Example",
      language: "kotlin",
      code: `class NewsRepository(
    private val newsApi: NewsApi,
    private val newsDao: NewsDao
) {
    fun getLatestNews(): Flow<Resource<List<NewsArticle>>> = flow {
        emit(Resource.Loading())
        
        try {
            // Fetch from network
            val apiResponse = newsApi.getLatestNews()
            
            // Save to database
            newsDao.insertAll(apiResponse.articles)
            
            // Emit from database for single source of truth
            emitAll(newsDao.getAllArticles().map { articles ->
                Resource.Success(articles)
            })
        } catch (e: Exception) {
            emit(Resource.Error(e.localizedMessage ?: "Unknown error"))
            
            // Emit cached data if available
            val cachedNews = newsDao.getAllArticles().first()
            if (cachedNews.isNotEmpty()) {
                emit(Resource.Success(cachedNews))
            }
        }
    }
}`,
    });

    this.createCodeSample({
      title: "Jetpack Compose UI Component",
      language: "kotlin",
      code: `@Composable
fun AnimatedCounter(
    count: Int,
    modifier: Modifier = Modifier,
    style: TextStyle = MaterialTheme.typography.h4
) {
    // Animation specs
    val animationSpec = remember {
        spring<Int>(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        )
    }
    
    // Animated value
    val animatedCount = animateIntAsState(
        targetValue = count,
        animationSpec = animationSpec
    )
    
    // UI implementation
    Box(
        modifier = modifier
            .background(
                color = MaterialTheme.colors.primary.copy(alpha = 0.15f),
                shape = RoundedCornerShape(8.dp)
            )
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Text(
            text = "\${animatedCount.value}",
            style = style,
            color = MaterialTheme.colors.primary
        )
    }
}`,
    });
  }
}

import { DatabaseStorage } from "./postgres-storage";

// Use the new PostgreSQL database storage
export const storage = new DatabaseStorage();
