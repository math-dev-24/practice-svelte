import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq, and, ne } from 'drizzle-orm';
import { user } from '$lib/server/db/schema';
import { hash, verify } from '@node-rs/argon2';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        throw redirect(302, '/login');
    }

    try {
        const userData = await db.query.user.findFirst({
            where: eq(user.id, event.locals.user.id)
        });

        if (!userData) {
            throw new Error("Utilisateur non trouvé");
        }

        return {
            user: userData
        };
    } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
        throw redirect(302, '/login');
    }
};

export const actions: Actions = {
    updateProfile: async (event) => {
        if (!event.locals.user) {
            throw redirect(302, '/login');
        }

        try {
            const formData = await event.request.formData();
            const username = formData.get('username')?.toString();
            const updatePassword = formData.has('update_password'); // boolean
            const tmp_password = formData.get('tmp_password')?.toString();
            const new_password = formData.get('new_password')?.toString();
            const new_password_check = formData.get('new_password_check')?.toString();

            if (!username) {
                return fail(400, {
                    error: true,
                    message: "Username requis",
                    type: "error"
                });
            }

            const currentUser = await db.query.user.findFirst({
                where: eq(user.id, event.locals.user.id)
            });

            if (!currentUser) {
                return fail(400, {
                    error: true,
                    message: "Utilisateur non trouvé",
                    type: "error"
                });
            }

            if (username !== currentUser.username) {
                const existingUser = await db.query.user.findFirst({
                    where: and(
                      eq(user.username, username),
                      ne(user.id, event.locals.user.id) // Exclure l'utilisateur actuel
                    )
                });

                if (existingUser) {
                    return fail(400, {
                        error: true,
                        message: "Ce nom d'utilisateur est déjà utilisé",
                        type: "error"
                    });
                }
            }

            if (updatePassword) {
                if (!tmp_password || !new_password || !new_password_check) {
                    return fail(400, {
                        error: true,
                        message: "Tous les champs de mot de passe sont requis",
                        type: "error"
                    });
                }

                if (new_password !== new_password_check) {
                    return fail(400, {
                        error: true,
                        message: "Les nouveaux mots de passe ne correspondent pas",
                        type: "error"
                    });
                }

                const isValidPassword = await verify(currentUser.passwordHash, tmp_password, {
                    memoryCost: 19456,
                    timeCost: 2,
                    outputLen: 32,
                    parallelism: 1
                });

                if (!isValidPassword) {
                    return fail(400, {
                        error: true,
                        message: "Mot de passe actuel incorrect",
                        type: "error"
                    });
                }
                const hashedNewPassword = await hash(new_password, {
                    memoryCost: 19456,
                    timeCost: 2,
                    outputLen: 32,
                    parallelism: 1
                });
                await db.update(user)
                  .set({
                      username,
                      passwordHash: hashedNewPassword
                  })
                  .where(eq(user.id, event.locals.user.id));
            } else {
                await db.update(user)
                  .set({
                      username
                  })
                  .where(eq(user.id, event.locals.user.id));
            }

            return {
                success: true,
                message: "Profil mis à jour avec succès",
                type: "success"
            };

        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil:", error);
            return fail(500, {
                error: true,
                message: "Erreur lors de la mise à jour du profil",
                type: "error"
            });
        }
    }
};