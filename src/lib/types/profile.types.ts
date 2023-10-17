export interface IProfile {
	id: number
	created_at: string
	uuid: string
	photo_url: string
	cover_photo_url: string | null
	name: string | null
	lastname: string | null
	username: string
	email: string
	public_name: string
}
