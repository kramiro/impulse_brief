const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=UTF-8" },
  });

const clean = (formData, key) => String(formData.get(key) || "").trim();

export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData();

    const idea = clean(formData, "idea");
    const contactName = clean(formData, "name");
    const email = clean(formData, "email");
    const phone = clean(formData, "phone");

    if (!idea || !contactName || (!email && !phone)) {
      return json({ error: "Faltan datos obligatorios." }, 400);
    }

    const files = formData
      .getAll("referenceFiles")
      .filter((file) => file && typeof file === "object" && file.size > 0);

    if (files.length > 5) {
      return json({ error: "Puedes adjuntar hasta 5 archivos." }, 400);
    }

    if (files.some((file) => file.size > 10 * 1024 * 1024)) {
      return json(
        { error: "Cada archivo debe pesar máximo 10 MB." },
        400,
      );
    }

    const attachments = [];

    for (const file of files) {
      const safeName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .slice(-100);

      const key = `briefs/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

      await env.UPLOADS.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type || "application/octet-stream",
        },
      });

      attachments.push({
        key,
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }

    const siteType =
      clean(formData, "siteType") === "Otro"
        ? `Otro: ${clean(formData, "siteTypeOther")}`
        : clean(formData, "siteType");

    const values = [
      clean(formData, "projectName"),
      idea,
      clean(formData, "goal"),
      siteType,
      clean(formData, "audience"),
      clean(formData, "color"),
      clean(formData, "font"),
      clean(formData, "typeTreatment"),
      clean(formData, "visualStyle"),
      clean(formData, "sections"),
      clean(formData, "references"),
      JSON.stringify(attachments),
      contactName,
      email,
      phone,
      clean(formData, "brand"),
      clean(formData, "timeline"),
      clean(formData, "domainChoice"),
      clean(formData, "domainName"),
    ];

    const result = await env.DB.prepare(`
      INSERT INTO briefs (
        project_name, idea, goal, site_type, audience,
        color, font, type_treatment, visual_style, sections,
        references_text, attachments, contact_name, email, phone, brand,
        timeline, domain_choice, domain_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(...values)
      .run();

    return json({ ok: true, id: result.meta.last_row_id });
  } catch (error) {
    console.error("Error saving brief", error);
    return json(
      { error: "No pudimos guardar tu brief. Inténtalo de nuevo." },
      500,
    );
  }
}const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=UTF-8" },
  });

const clean = (formData, key) => String(formData.get(key) || "").trim();

export async function onRequestPost({ request, env }) {
  try {
    const formData = await request.formData();

    const idea = clean(formData, "idea");
    const contactName = clean(formData, "name");
    const email = clean(formData, "email");
    const phone = clean(formData, "phone");

    if (!idea || !contactName || (!email && !phone)) {
      return json({ error: "Faltan datos obligatorios." }, 400);
    }

    const files = formData
      .getAll("referenceFiles")
      .filter((file) => file && typeof file === "object" && file.size > 0);

    if (files.length > 5) {
      return json({ error: "Puedes adjuntar hasta 5 archivos." }, 400);
    }

    if (files.some((file) => file.size > 10 * 1024 * 1024)) {
      return json(
        { error: "Cada archivo debe pesar máximo 10 MB." },
        400,
      );
    }

    const attachments = [];

    for (const file of files) {
      const safeName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .slice(-100);

      const key = `briefs/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

      await env.UPLOADS.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type || "application/octet-stream",
        },
      });

      attachments.push({
        key,
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }

    const siteType =
      clean(formData, "siteType") === "Otro"
        ? `Otro: ${clean(formData, "siteTypeOther")}`
        : clean(formData, "siteType");

    const values = [
      clean(formData, "projectName"),
      idea,
      clean(formData, "goal"),
      siteType,
      clean(formData, "audience"),
      clean(formData, "color"),
      clean(formData, "font"),
      clean(formData, "typeTreatment"),
      clean(formData, "visualStyle"),
      clean(formData, "sections"),
      clean(formData, "references"),
      JSON.stringify(attachments),
      contactName,
      email,
      phone,
      clean(formData, "brand"),
      clean(formData, "timeline"),
      clean(formData, "domainChoice"),
      clean(formData, "domainName"),
    ];

    const result = await env.DB.prepare(`
      INSERT INTO briefs (
        project_name, idea, goal, site_type, audience,
        color, font, type_treatment, visual_style, sections,
        references_text, attachments, contact_name, email, phone, brand,
        timeline, domain_choice, domain_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(...values)
      .run();

    return json({ ok: true, id: result.meta.last_row_id });
  } catch (error) {
    console.error("Error saving brief", error);
    return json(
      { error: "No pudimos guardar tu brief. Inténtalo de nuevo." },
      500,
    );
  }
}
