-- Remove permissões explícitas antigas do papel público anônimo.
-- As próprias funções também validam private.is_admin(), em defesa em profundidade.

revoke all on function public.duplicate_magazine_edition(uuid, text) from public;
revoke all on function public.publish_magazine_edition(uuid) from public;
revoke all on function public.duplicate_magazine_edition(uuid, text) from anon;
revoke all on function public.publish_magazine_edition(uuid) from anon;

grant execute on function public.duplicate_magazine_edition(uuid, text) to authenticated;
grant execute on function public.publish_magazine_edition(uuid) to authenticated;
