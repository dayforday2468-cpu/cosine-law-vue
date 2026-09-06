<script setup>
import { profile } from '@/data/profile.js'
</script>

<template>
  <section class="profile-container">
    <div class="profile-image-wrapper">
      <img class="profile-image" src="/images/profile.jpg" alt="프로필 사진" />
    </div>
    <div class="profile-content">
      <header class="profile-header">
        <p class="profile-role">{{ profile.role }}</p>

        <p class="profile-introduction">{{ profile.introduction }}</p>
      </header>

      <div class="profile-details">
        <section class="profile-section">
          <h2>Education</h2>

          <ul>
            <li v-for="item in profile.education" :key="item.school">
              <strong>{{ item.school }}</strong>
              <span>{{ item.detail }}</span>
            </li>
          </ul>
        </section>

        <section class="profile-section">
          <h2>Experience</h2>

          <ul>
            <li v-for="item in profile.experiences" :key="item.organization">
              <a
                v-if="item.url"
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="profile-link"
              >
                <strong>{{ item.organization }}</strong>
              </a>

              <strong v-else>{{ item.organization }}</strong>

              <span>{{ item.detail }}</span>
            </li>
          </ul>
        </section>
      </div>

      <section class="profile-skills">
        <h2>Interests & Skills</h2>

        <ul class="skill-list">
          <li v-for="skill in profile.skills" :key="skill" class="skill-tag">
            {{ skill }}
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<style scoped>
.profile-container {
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(0, 2fr);
  gap: var(--space-l);

  width: min(var(--container-width), calc(100% - var(--space-l)));
  margin: var(--space-l) auto;
  padding: var(--space-l);

  border: var(--border-default);
  border-radius: var(--radius-l);

  background: var(--color-background);

  cursor: default;
}

.profile-image-wrapper {
  min-width: 0;
}

.profile-image {
  display: block;

  width: 100%;
  aspect-ratio: 4 / 5;

  border: var(--border-default);
  border-radius: var(--radius-l);

  object-fit: cover;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-l);

  min-width: 0;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.profile-role {
  margin: 0 0 var(--space-s);

  color: var(--color-main);

  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-semibold);
}

.profile-introduction {
  margin: var(--space-m) 0 0;

  color: var(--color-text-content);

  font-family: var(--font-family-content);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-regular);
  line-height: 1.8;
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-l);
}

.profile-section h2,
.profile-skills h2 {
  margin: 0 0 var(--space-m);

  color: var(--color-text-main);

  font-family: var(--font-family-content);
  font-size: var(--font-size-m);
  font-weight: var(--font-weight-semibold);
}

.profile-section ul,
.skill-list {
  margin: 0;
  padding: 0;

  list-style: none;
}

.profile-section li {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);

  margin-bottom: var(--space-m);

  font-family: var(--font-family-content);
}

.profile-section li:last-child {
  margin-bottom: 0;
}

.profile-section strong {
  color: var(--color-text-main);

  font-size: var(--font-size-m);
  font-weight: var(--font-weight-semibold);
}

.profile-section span {
  color: var(--color-text-sub);

  font-size: var(--font-size-s);
  font-weight: var(--font-weight-regular);
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-s);
}

.skill-tag {
  padding: var(--space-s) var(--space-m);

  border: var(--border-default);
  border-radius: var(--radius-l);

  background: var(--color-background-sub);
  color: var(--color-text-content);

  font-family: var(--font-family-content);
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-semibold);
}

.profile-link {
  color: var(--color-text-main);
  text-decoration: none;
  transition: color 0.2s ease;
}

.profile-link strong {
  color: inherit;
}

.profile-link:hover {
  color: var(--color-main);
}

@media (max-width: 768px) {
  .profile-container {
    grid-template-columns: 1fr;

    width: min(var(--container-width), calc(100% - var(--space-m)));
    padding: var(--space-m);
  }

  .profile-image-wrapper {
    max-width: 280px;
  }

  .profile-details {
    grid-template-columns: 1fr;
    gap: var(--space-m);
  }
}
</style>
