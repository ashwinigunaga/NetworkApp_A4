from django.shortcuts import redirect, render
from .models import Post
from .models import Photo
from django.http import JsonResponse, HttpResponse
from .forms import PostForm
from profiles.models import Profile
from .utils import action_permission
from django.contrib.auth.decorators import login_required
# Create your views here.

@login_required
def post_list_and_create(request):
    form = PostForm(request.POST or None)
    #qs = Post.objects.all()

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            instance = form.save(commit = False)
            instance.author = author
            instance.save()
            return JsonResponse({
                'title': instance.title,
                'body': instance.body,
                'author': instance.author.user.username,
                'id': instance.id
            })
    context = {
        'form': form,
    }
    return render(request, 'posts/main.html', context)

@login_required
def post_detail(request, pk):
    obj = Post.objects.get(pk=pk)
    form = PostForm()

    context ={
        'obj': obj,
        'form': form,
    }

    return render(request, 'posts/detail.html', context)

@login_required
def load_post_data_view(request, num_posts):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        visible = 3
        upper = num_posts
        lower = upper - visible
        size = Post.objects.all().count()

        qs = Post.objects.all()
        data = []
        for obj in qs:
            item ={
                'id': obj.id,
                'title': obj.title,
                'body': obj.body,
                'liked': True if request.user in obj.liked.all() else False,
                'count': obj.like_count,
                'author': obj.author.user.username
            }
            data.append(item)
        return JsonResponse({'data':data[lower:upper], 'size': size})
    return redirect('posts:main-board')

@login_required
def post_detail_data_view(request, pk):
    obj = Post.objects.get(pk=pk)
    data={
        'id': obj.id,
        'title': obj.title,
        'body': obj.body,
        'author': obj.author.user.username,
        'logged_in': request.user.username,
    }
    return JsonResponse({'data':data})


@login_required
def like_unlike_post(request):
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)
        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)
        return JsonResponse({'liked': liked, 'count': obj.like_count})
    return redirect('posts:main-board')


@login_required
@action_permission
def update_post(request, pk):
        obj = Post.objects.get(pk=pk)
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            new_title = request.POST.get('title')
            new_body = request.POST.get('body')
            obj.title = new_title
            obj.body = new_body
            obj.save()
            return JsonResponse({
                'title': new_title,
                'body': new_body,
            })
        return redirect('posts:main-board')

        
@login_required
@action_permission
def delete_post(request, pk):
        obj = Post.objects.get(pk=pk)
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            obj.delete()
            return JsonResponse({'msg': 'Delete msg'})
        return redirect('posts:main-board')

@login_required
def image_upload_view(request):
    #print(request.FILES)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        img = request.FILES.get('file')
        new_post_id = request.POST.get('new_post_id')
        post = Post.objects.get(id=new_post_id)
        Photo.objects.create(image=img, post=post)
    return HttpResponse()

