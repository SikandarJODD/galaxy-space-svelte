type IHeaderOption = {
	name: 'notifications' | 'menu' | 'dropdown'
	icon: string
	customClass: string
	onclick: (params?: any) => void
}

type IHeaderConfig = {
	options: IHeaderOption[]
}

export const HeaderConfig: IHeaderConfig = {
	options: [
		// {
		// 	name: 'menu',
		// 	icon: 'ic:twotone-apps',
		// 	customClass: '',
		// 	onclick: (params?: any) => {
		// 		console.log('Menu')
		// 	}
		// },
		{
			name: 'notifications',
			icon: 'mingcute:notification-line',
			customClass: '',
			onclick: (params?: any) => {
				const { isNotificationsOpen, value, isDropdownOpen } = params
				isNotificationsOpen.set(!value)
				isDropdownOpen.set(false)
			}
		},
		{
			name: 'dropdown',
			icon: 'eva:arrow-down-fill',
			customClass: '',
			onclick: (params?: any) => {
				const { isDropdownOpen, value, isNotificationsOpen } = params
				isDropdownOpen.set(!value)
				isNotificationsOpen.set(false)
			}
		}
	]
}
