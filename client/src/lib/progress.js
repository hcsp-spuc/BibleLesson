import { supabase } from './supabase'

export function localKey(categoryId, lessonNumber) {
  return `cat${categoryId}_lesson${lessonNumber}_done`
}

export async function markLessonDone(categoryId, lessonNumber) {
  localStorage.setItem(localKey(categoryId, lessonNumber), 'true')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('user_progress').upsert(
    { user_id: user.id, category_id: categoryId, lesson_number: lessonNumber },
    { onConflict: 'user_id,category_id,lesson_number' }
  )
}

export async function syncProgressFromServer(categoryId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data } = await supabase
    .from('user_progress')
    .select('category_id, lesson_number')
    .eq('user_id', user.id)
    .eq('category_id', categoryId)
  if (data) {
    data.forEach(({ category_id, lesson_number }) => {
      localStorage.setItem(localKey(category_id, lesson_number), 'true')
    })
  }
}
