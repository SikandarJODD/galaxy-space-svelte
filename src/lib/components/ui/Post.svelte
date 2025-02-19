<script lang="ts">
	import { currentUser } from '$lib/store/currentUser'
	import { LikesRepository } from '$lib/supabase/likes/LikesRepository'
	import type { IPost } from '$lib/types/post.types'
	import { likesShower } from '$lib/utils/likesShower'
	import Icon from '@iconify/svelte'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import dayjs from 'dayjs'
	import ModalShare from './ModalShare.svelte'
	import TooltipLikes from './TooltipLikes.svelte'
	import VerifiedIcon from './VerifiedIcon.svelte'

	export let supabase: SupabaseClient
	export let post: IPost
	let btnLikeDisable = false
	let isActiveModalShare = false

	const likeRepository = new LikesRepository()

	const handleLike = async (post: IPost) => {
		btnLikeDisable = true
		const isLiked = await likeRepository.setLike(supabase, post.post_id, $currentUser)
		if (isLiked) {
			// @ts-ignore
			post.isLiked = true
			post.totalLikes++
		}
		btnLikeDisable = false
	}

	const handleDislike = async (post: IPost) => {
		btnLikeDisable = true
		const isNotLiked = await likeRepository.removeLike(supabase, post.post_id, $currentUser)
		if (isNotLiked) {
			// @ts-ignore
			post.isLiked = false
			post.totalLikes--
		}
		btnLikeDisable = false
	}
</script>

<svelte:head>
	<title
		>{post.text?.slice(0, 10)}
		{post.text && post.text.length > 10 ? '...' : ''} | Galaxy Space</title
	>

	<meta name="keywords" content={post.text?.replaceAll(' ', ',')} />
	<meta name="title" content={post.text} />
	<meta name="description" content={post.text ?? ''} />
</svelte:head>

<section class="my-2 flex flex-col gap-3">
	{#if post.text || post.image_url}
		<article
			class="relative flex flex-col gap-2 pb-10 bg-white dark:bg-dark_white py-2 rounded-lg shadow-sm"
		>
			<a
				class="flex ml-2 max-w-max rounded-md gap-1.5 pl-0.5 py-1.5 transition-all"
				href="/space/u/{post.user?.username}"
			>
				<img
					class="w-10 h-10 rounded-full object-cover"
					src={post.user.photo_url}
					alt={post.username}
				/>
				<div class="flex flex-col leading-4">
					<p class="flex items-center gap-1 dark:text-dark_text">
						{post.user.public_name}
						<VerifiedIcon isStar={post.user.is_star} />
					</p>
					<p class="text-sm font-semibold text-gray-500 dark:text-dark">@{post.username}</p>
				</div>
			</a>
			{#if post.text}
				<p class="px-3.5 text-[15px] dark:text-dark_text">
					{@html post.text}
				</p>
			{/if}

			{#if post.image_url}
				<div
					class="w-full h-max mt-1"
					style="background-image: url({post.image_url}); background-size: cover; background-position: center;"
				>
					<div class="w-full h-max backdrop-blur-md">
						<img class="w-auto mx-auto h-full max-h-[450px]" src={post.image_url} alt="xd" />
					</div>
				</div>
			{/if}

			<!-- Stats -->
			<div class="mx-3 flex items gap-2 border-b dark:border-dark_light_gray">
				<button
					class="relative hover:text-black group star-count-post-{post.id} text-sm text-dark font-semibold"
				>
					{likesShower(post.totalLikes)}
					<div class="hidden group-hover:flex text-dark">
						<TooltipLikes likes={post.likes} />
					</div>
				</button>
			</div>

			<div
				class="flex gap-3 items-center px-3 py-1 border-b dark:border-dark_light_gray border-light_gray"
			>
				{#if post.isLiked}
					<button
						disabled={btnLikeDisable}
						on:click={() => handleDislike(post)}
						type="button"
						class="outline-none flex items-center gap-1 dark:bg-dark_bg dark:text-white bg-light_gray hover:bg-light_gray transition-all duration-100 pr-4 p-1.5 rounded-md"
					>
						<Icon icon="solar:star-bold-duotone" width="24" color="var(--primary)" />
						<span class="translate-y-0.5 text-lg font-semibold">{post.totalLikes}</span>
					</button>
				{:else}
					<button
						disabled={btnLikeDisable}
						on:click={() => handleLike(post)}
						type="button"
						class="outline-none bg-light_gray dark:bg-dark_light_gray dark:text-white flex items-center gap-1 active:bg-primary active:text-white transition-all duration-50 pr-4 p-1.5 rounded-md"
					>
						<Icon icon="solar:star-line-duotone" width="23" />
						<span class="translate-y-0.5 text-lg">{post.totalLikes}</span>
					</button>
				{/if}

				<button
					class="bg-light_gray dark:bg-dark_light_gray dark:text-white pr-2 pl-2.5 pb-0.5 h-10 grid place-content-center outline-none transition-all duration-50 rounded-md text-dark
							active:scale-95 active:duration-0 active:bg-primary active:text-white {isActiveModalShare
						? 'bg-primary text-white shadow-md '
						: ''} "
					on:click={() => {
						isActiveModalShare = !isActiveModalShare
						if (isActiveModalShare) {
							if (typeof window !== 'undefined') {
								setTimeout(() => {
									const modal = document.querySelector(`.modalShare-${post.id}`)
									// @ts-ignore
									modal.style.display = 'flex'
								}, 10)
							}
						}
					}}
				>
					<Icon class="text-inherit" icon="carbon:copy-link" width="23" />
				</button>

				<ModalShare bind:enable={isActiveModalShare} {post} classID={post.id.toString()} />

				<div class="absolute bottom-2 left-3 text-sm text-dark">
					{dayjs(post.created_at).format('DD-MM-YYYY h:mm A')}
				</div>
			</div>
		</article>
	{/if}
</section>
