import PageLayout from '@/components/pageLayout'
import { getPermissions } from '@/utils/server-api/getPermissions'
import NoAccess from '@/components/static/noAccess'
import DoesNotExist from '@/components/static/doesNotExist'
import UserClientPage from '@/app/[locale]/(dashboard)/dashboard/users/[userId]/page.client'
import { serverUserApi } from '@/lib/server-api'

export const runtime = 'edge'

export default async function UserPage(props) {
  const params = await props.params

  const { userId } = params

  const permissions: any = await getPermissions()
  const requiredPermissions = [
    'cloudnet_rest:user_read',
    'cloudnet_rest:user_get',
    'global:admin',
  ]

  // check if user has required permissions
  const hasPermissions = requiredPermissions.some((permission) =>
    permissions.includes(permission)
  )

  if (!hasPermissions) {
    return <NoAccess />
  }

  let user: User | null = null
  try {
    user = await serverUserApi.get(userId)
  } catch {
    return <DoesNotExist name={'User'} />
  }

  return (
    <PageLayout title={`Edit ${user.username}`}>
      <UserClientPage user={user} />
    </PageLayout>
  )
}
