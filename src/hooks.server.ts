// src/hooks.server.ts
import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_PHOTO_DEFAULT
} from '$env/static/public'
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit'
import { redirect, type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	})

	event.locals.getSession = async () => {
		const {
			data: { session }
			// @ts-ignore
		} = await event.locals.supabase.auth.getSession()

		return session
	}

	const {
		data: { user }
	} = await event.locals.supabase.auth.getUser()

	if (user) {
		const { data: getUserData, error: errorUserData } = await event.locals.supabase
			.from('register')
			.select()
			.eq('uuid', user.id)

		const { data: getProfileData, error: errorProfileData } = await event.locals.supabase
			.from('profiles')
			.select()
			.eq('uuid', getUserData![0].uuid)

		const session = await event.locals.getSession()

		event.locals.user = {
			email: user.email as string,
			access_token: session!.access_token as string,
			public_name: getUserData![0].public_name,
			photo_url: getProfileData![0].photo_url,
			username: getUserData![0].username,
			refresh_token: session!.refresh_token,
			uuid: getUserData![0].uuid,
			role: getUserData![0].role
		}
	}

	if (event.url.pathname === '/') {
		throw redirect(303, '/login')
	}

	if (event.url.pathname.includes('/space') && !user) {
		throw redirect(303, '/login')
	}

	if (event.url.pathname.includes('/login') && user) {
		throw redirect(303, '/space')
	}

	return resolve(event)
}
